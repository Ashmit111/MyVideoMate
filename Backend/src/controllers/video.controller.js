import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
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
        const {
            page = 1,
            limit = 10,
            query = "",
            sortBy = "createdAt",
            sortType = "desc",
        } = req.query;

        const sortOrder = sortType === "asc" ? 1 : -1;

        // Log received query parameters for debugging
        console.log("Request Query Parameters:", { page, limit, query, sortBy, sortType });

        // Fetch videos with a direct query and population of 'owner' field
        const allVideos = await Video.find(query ? { $text: { $search: query } } : {})
            .populate("owner", "username avatar")  // Populate owner with 'username' and 'avatar' fields
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(parseInt(limit, 10))
            .select("-videoFile -isPublished ");


        // Log fetched videos
        console.log("Fetched Videos:", allVideos);

        if (!allVideos.length) {
            console.log(`No videos found for query: "${query}"`);
            throw new ApiError(404, `No videos found for query: "${query}"`);
        }

        // Return the response with fetched videos
        return res.status(200).json(
            new ApiResponse(200, allVideos, "Videos fetched successfully")
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
        // const subscribers = await Subscription.find({ channel: owner });

        // Notify each subscriber
        // for (const subscription of subscribers) {
        //     const subscriberId = subscription.subscriber;
        //     const message = `New video "${title}" published by a channel you follow!`;

        //     // Use WebSocket to create and send the notification
        //     await createAndSendNotification(subscriberId, message, video._id, req.io);
        // }

        const createdVideo = await Video.findById(video._id);

        if (!createdVideo) {
            throw new ApiError(500, "Something went wrong while uploading the video");
        }
 
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

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json(
                new ApiResponse(400, null, "Invalid Video ID")
            );
        }

        const video = await Video.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(videoId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $addFields: {
                    userDetails: { $arrayElemAt: ["$userDetails", 0] },
                },
            },
            {
                $project: {
                    videoFile: 1, // Include the video URL field
                    title: 1,
                    description: 1,
                    thumbnail: 1, 
                    views: 1, 
                    "userDetails.username": 1,
                    "userDetails.avatar": 1,
                    "userDetails.fullName": 1,
                    "userDetails._id": 1,
                },
            },
        ]);

        if (!video.length) {
            return res.status(404).json(
                new ApiResponse(404, null, "Video not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(200, video[0], "Video Details fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching video:", error);
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to fetch video")
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
    const { videoId } = req.params;
    console.log("Video ID:", videoId);
  
    // Validate videoId
    if (!videoId) {
      throw new ApiError(400, "Video ID is required");
    }
  
    try {
      // Find the video by ID
      const video = await Video.findByIdAndDelete(videoId);
      console.log("Video:", video);
  
      if (!video) {
        console.log("Video not found");
      }
   
      res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete video", error: error.message });
    }
  });

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

const addToWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;  
    try {
        const user = await User.findById(req.user._id);  
 
        const isVideoInHistory = user.watchHistory.includes(videoId);

        const video = await Video.findById(videoId); 

        if (!video) {
            return res.status(404).json(
                new ApiResponse(404, null, "Video not found")
            );
        }
 
        if (!isVideoInHistory) {
            // Add the video to the watch history if it's not already there
            user.watchHistory.push(videoId);
            await user.save(); // Save the updated user document

            video.views += 1;
            await video.save(); // Save the updated video document

            return res.status(200).json(
                new ApiResponse(
                    200,
                    user.watchHistory,
                    "Video added to watch history successfully and view count incremented"
                )
            );
        } else {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    user.watchHistory,
                    "Video is already in the watch history"
                )
            );
        }
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to add video to watch history")
        );
    }
});
  

export {
    getAllVideos,
    homepageVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    addToWatchHistory
}
