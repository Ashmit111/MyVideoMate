import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import { Like } from "../models/like.model.js"
import {Comment} from "../models/comment.model.js"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import ffmpeg from 'fluent-ffmpeg'; 
import { formatDistanceToNowStrict } from 'date-fns';
import { Readable } from 'stream';
import fs from "fs/promises"

const getVideoDurationFromBuffer = async (fileBuffer) => {
    const tempFilePath = `temp_video_${Date.now()}.mp4`;
    await fs.writeFile(tempFilePath, fileBuffer);

    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
            fs.unlink(tempFilePath); // Clean up temporary file
            if (err) {
                return reject(new ApiError(500, "Error processing video duration"));
            }
            resolve(Math.floor(metadata.format.duration));
        });
    });
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

        const formattedVideos = allVideos.map(video => ({
            ...video.toObject(),
            createdAt: formatDistanceToNowStrict(new Date(video.createdAt), { addSuffix: true })
          }));

        // Return the response with fetched videos
        return res.status(200).json(
            new ApiResponse(200, formattedVideos, "Videos fetched successfully")
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
        const formattedVideos = videos.map(video => ({
            ...video.toObject(),
            createdAt: formatDistanceToNowStrict(new Date(video.createdAt), { addSuffix: true })
          }));

        // Return the videos along with user details
        return res.status(200).json(
            new ApiResponse(200, formattedVideos, "Videos fetched successfully")
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

        // Access uploaded files from Multer's memory storage
        const thumbnailFile = req.files?.thumbnail?.[0];
        const videoFile = req.files?.videoFile?.[0];

        if (!thumbnailFile) {
            throw new ApiError(400, "Thumbnail file is required");
        }

        if (!videoFile) {
            throw new ApiError(400, "Video file is required");
        }

        // Calculate video duration using ffmpeg
        const duration = await getVideoDurationFromBuffer(videoFile.buffer);

        // Upload files to Cloudinary
        const thumbnail = await uploadOnCloudinary(thumbnailFile.buffer );
        const videoCloudFile = await uploadOnCloudinary(videoFile.buffer );

        if (!thumbnail?.url) {
            throw new ApiError(500, "Failed to upload thumbnail");
        }

        if (!videoCloudFile?.url) {
            throw new ApiError(500, "Failed to upload video file");
        }

        // Create a new video document in the database
        const video = await Video.create({
            title,
            description,
            thumbnail: thumbnail.url,
            videoFile: videoCloudFile.url,
            owner,
            duration,
        });

        const createdVideo = await Video.findById(video._id);
        if (!createdVideo) {
            throw new ApiError(500, "Something went wrong while saving video details");
        }

        // Return the created video object
        return res.status(201).json(
            new ApiResponse(200, createdVideo, "Video uploaded successfully")
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
                    createdAt: 1,
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

        const formattedVideo = {
            ...video[0],
            createdAt: formatDistanceToNowStrict(new Date(video[0].createdAt), { addSuffix: true })
          };

        return res.status(200).json(
            new ApiResponse(200, formattedVideo, "Video Details fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching video:", error);
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to fetch video")
        );
    }
});



const updateVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        const { title, description } = req.body;
        const owner = req.user._id;

        // Access uploaded thumbnail from Multer's memory storage
        const thumbnailFile = req.file;

        console.log("Video ID:", videoId);
        console.log("Title:", title);
        console.log("Description:", description);
        console.log("Owner:", owner);

        if (!thumbnailFile) {
            throw new ApiError(400, "Thumbnail is missing");
        }

        // Fetch the old video document
        const oldVideo = await Video.findById(videoId);
        if (!oldVideo) {
            throw new ApiError(404, "Video not found");
        }

        const oldThumbnailUrl = oldVideo.thumbnail;

        // Delete old thumbnail from Cloudinary if it exists
        if (oldThumbnailUrl) {
            await deleteFromCloudinary(oldThumbnailUrl); // Ensure this function is implemented
        }

        // Upload the new thumbnail to Cloudinary
        const thumbnail = await uploadOnCloudinary(thumbnailFile.buffer);

        if (!thumbnail?.url) {
            throw new ApiError(400, "Error while uploading the new thumbnail");
        }

        // Update video details in the database
        const updatedVideo = await Video.findOneAndUpdate(
            { _id: videoId, owner },
            {
                $set: {
                    title,
                    description,
                    thumbnail: thumbnail.url,
                },
            },
            { new: true }
        );

        if (!updatedVideo) {
            throw new ApiError(403, "Unauthorized or video not found");
        }

        return res.status(200).json(
            new ApiResponse(200, updatedVideo, "Video updated successfully")
        );
    } catch (error) {
        console.error("Error updating video:", error);
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to update video")
        );
    }
});


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
      const like =  await Like.deleteMany({video: videoId});
      const comment = await Comment.deleteMany({video: videoId});
      const playlist = await Playlist.updateMany(
        { videos: videoId },
        { $pull: { videos: videoId } }
      );
      console.log("Like:", like); 
      console.log("Video:", video);
      console.log("Comment:", comment);
      console.log("Playlist:", playlist);
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
