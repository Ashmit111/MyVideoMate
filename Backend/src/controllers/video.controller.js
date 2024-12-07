import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

const deleteFromCloudinary = async (imageUrl) => {
    const publicId = extractPublicId(imageUrl); 
    await cloudinary.uploader.destroy(publicId);
};


const extractPublicId = (url) => {
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1];
    return publicIdWithExtension.split('.')[0]; // Remove file extension
};

const getAllVideos = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } = req.query;
        
        const sortOrder = sortType === "asc" ? 1 : -1;
        
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { [sortBy]: sortOrder } 
        };

        const searchConditions = [];
        if (query) {
            searchConditions.push(
                { $text: { $search: query } }, 
                { title: { $regex: query, $options: "i" } },
                { owner: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            );
        }
        
        const videoQuery = Video.aggregate([
            {
                $match: searchConditions.length > 0 ? { $or: searchConditions } : {}
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "videoWithUserDetails"
                }
            },
            {
                $unwind: "$videoWithUserDetails" 
            },
            {
                $project: {
                    title: 1, 
                    createdAt: 1,
                    thumbnail: 1, 
                    duration: 1,
                    views: 1,
                    "videoWithUserDetails.username": 1,
                    "videoWithUserDetails.avatar": 1
                }
            }
        ]);
        
        const allVideos = await Video.aggregatePaginate(videoQuery, options);

        if (!allVideos.docs.length) {
            throw new ApiError(404, "No videos found");
        }

        return res.status(200).json(
            new ApiResponse(200, allVideos.docs, "Videos fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching videos:", error);
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to fetch videos")
        );
    }
});

const homepageVideos = asyncHandler(async (req, res) => {
    try {
        // Fetch the first 16 videos sorted by the most recent
        const videos = await Video.find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(16) // Limit to 16 videos
            .select("thumbnail title duration views createdAt")
            .populate("owner", "username avatar"); // Populate the owner's username and avatar
            

        // Check if no videos are found
        if (!videos.length) {
            return res.status(404).json(
                new ApiResponse(404, null, "No videos found")
            );
        }

        // Return the videos along with user details
        return res.status(200).json(
            new ApiResponse(200, videos, "Videos fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching homepage videos:", error);
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to fetch homepage videos")
        );
    }
});




const publishAVideo = asyncHandler(async (req, res) => {
    try {
        const { title, description } = req.body;   
        const owner = req.user._id;
        const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
        const videoLocalPath = req.files?.videoFile[0]?.path;

        if (!thumbnailLocalPath) {
            throw new ApiError(400, "Thumbnail file is required");
        }

        if (!videoLocalPath) {
            throw new ApiError(400, "Video file is required");
        }

        let duration = 0;
        await new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoLocalPath, (err, metadata) => {
                if (err) {
                    console.error("Error retrieving video duration:", err);
                    reject(new ApiError(500, "Failed to process video file"));
                } else {
                    duration = Math.floor(metadata.format.duration); // Duration in seconds
                    resolve();
                }
            });
        });

        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        const videoFile = await uploadOnCloudinary(videoLocalPath);

        if (!thumbnail) {
            throw new ApiError(400, "Thumbnail file not uploaded");
        }

        if (!videoFile) {
            throw new ApiError(400, "Video file not uploaded");
        }

        const video = await Video.create({
            title,
            description,
            thumbnail: thumbnail.url,
            videoFile: videoFile.url,
            owner,
            duration, 
        });

        // Find all subscribers of this channel (owner)
        const subscribers = await Subscription.find({ channel: owner });

        // Notify each subscriber
        for (const subscription of subscribers) {
            const subscriberId = subscription.subscriber;
            const message = `New video "${title}" published by a channel you follow!`;

            // Use WebSocket to create and send the notification
            await createAndSendNotification(subscriberId, message, video._id, req.io);
        }

        const createdVideo = await Video.findById(video._id);

        if (!createdVideo) {
            throw new ApiError(500, "Something went wrong while uploading the video");
        }

        fs.unlinkSync(thumbnailLocalPath);
        fs.unlinkSync(videoLocalPath);

        return res.status(201).json(
            new ApiResponse(200, createdVideo, "Video Uploaded Successfully")
        );
    } catch (error) {
        console.error("Error publishing video:", error);
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to publish video")
        );
    }
});

const getVideoById = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        const video = await Video.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(videoId) 
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $addFields: {
                    userDetails: { $arrayElemAt: ["$userDetails", 0] } // Only take the first matching user
                }
            },
            {
                $project: {
                    "userDetails.username": 1,
                    "userDetails.avatar": 1,
                    "userDetails.fullName": 1
                }
            }
        ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                video[0]?.userDetails || [],
                "Video Details fetched successfully"
            )
        );
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(
                500,
                null,
                "Failed to fetch video"
            )
        ); 
    }
});


const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
    try {
        const { videoId } = req.params;
        const { title, description } = req.body;
        const thumbnailLocalPath = req.file?.path

        if (!thumbnailLocalPath) {
            throw new ApiError(400, "Thumbnail is missing")
        }

        //TODO: delete old image - assignment
        const oldvideo = await Video.findById(videoId);
        const oldThumbnailUrl = video.thumbnail;

        // Delete old thumbnail from Cloudinary if it exists
        if (oldThumbnailUrl) {
            await deleteFromCloudinary(oldThumbnailUrl); // Implement this function
        }

        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnail.url) {
            throw new ApiError(400, "Error while uploading on thumbnail")
            
        }
    
        const video = await Video.findOneAndUpdate(
            {_id: videoId,owner},
            {
                $set:{
                    title,
                    description,
                    thumbnail: thumbnail.url
                }
            },
            {new: true}
        ).select("-password")

        return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Thumbnail updated successfully")
        )
    
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(
                500,
                null,
                "Failed to update thumbnail"
            )
        ); 
    }
})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    try {
        const { videoId } = req.params;
        const deletedVideo = await Video.deleteOne({_id: videoId,owner});

        if(!deletedVideo){
            return res.status(404).json(new ApiResponse(404, null, "Video not found or not authorized"));
        }

        return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to delete video"));
    }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    try {
        const {videoId} = req.params;
        const owner = req.user._id;
    
        if (!isValidObjectId(videoId)) {
            throw new ApiError(400, "Invalid video ID");
        }

        const video = await Video.findById(videoId)
        
        const publishStatus = await Video.findOneAndUpdate(
            {_id: videoId, owner},
            {$set: {isPublished : !video.isPublished}},
            { new: true }
        )

        return res.status(200).json(new ApiResponse(200, publishStatus, "Publish Status Toggled successfully"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to toggle Publish Status"));
    }
})

export {
    getAllVideos,
    homepageVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
