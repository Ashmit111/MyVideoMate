import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js" 

 const toggleAndGetLikes = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id; 

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video ID");
    }

    // Handle POST request to toggle like
    if (req.method === "POST") {
      const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

      if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id); // Remove like
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Like removed successfully"));
      } else {
        await Like.create({ video: videoId, likedBy: userId }); // Add like
        return res.status(200).json(new ApiResponse(200, { liked: true }, "Like added successfully"));
      }
    }

    // Handle GET request to fetch like count and user like status
    if (req.method === "GET") {
      const likeCount = await Like.countDocuments({ video: videoId });
      const liked = await Like.findOne({ video: videoId, likedBy: userId });

      return res.status(200).json(
        new ApiResponse(200, { likeCount, liked: !!liked }, "Like count fetched successfully")
      );
    }
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, `Error: ${error.message}`));
  }
});



const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    try {
        const {commentId} = req.params;
        const userId = req.user._id;

        if (!isValidObjectId(commentId)) {
            throw new ApiError(400, "Invalid comment ID");
        }
    
        const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });
        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id)
            return res.status(200).json(new ApiResponse(200, { liked: false }, "Like removed successfully"));
        } else {
            await Like.create({comment: commentId, likedBy: userId})
            return res.status(200).json(new ApiResponse(200, { liked: true }, "Like added successfully"));
        }     
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error toggling like: ${error.message}`));
    }
    
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    try {
        const {tweetId} = req.params;
        const userId = req.user._id;

        if (!isValidObjectId(tweetId)) {
            throw new ApiError(400, "Invalid tweet ID");
        }
    
        const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });
        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id)
            return res.status(200).json(new ApiResponse(200, { liked: false }, "Like removed successfully"));
        } else {
            await Like.create({tweet: tweetId, likedBy: userId})
            return res.status(200).json(new ApiResponse(200, { liked: true }, "Like added successfully"));
        }     
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error toggling like: ${error.message}`));
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    try {
        const userId = req.user._id;

        const likedVideos = await Like.find({ likedBy: userId })
            .populate({
                path: "video",
                populate: {
                    path: "owner", // Path to populate the owner of the video
                    select: "username avatar", // Only select the username and avatar fields
                },
            });

        if (likedVideos.length > 0) {
            return res
                .status(200)
                .json(
                    new ApiResponse(200, likedVideos, "Liked Videos fetched successfully")
                );
        } else {
            throw new ApiError(404, "No liked Videos");
        }
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to fetch liked videos")
        );
    }
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleAndGetLikes,
    getLikedVideos
}