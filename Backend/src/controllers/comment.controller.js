import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
  
    try { 
      const comments = await Comment.find({ video: videoId })
        .populate({
          path: "owner",
          select: "username avatar",  
        })
        .skip((page - 1) * limit) // Pagination: Skip to the correct page
        .limit(limit) // Pagination: Limit the results
        .exec();
  
      if (comments.length > 0) {
        return res.status(200).json(
          new ApiResponse(200, comments, "Comments fetched successfully")
        );
      } else {
        return res.status(404).json(
          new ApiResponse(404, [], "No comments found for this video")
        );
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json(
        new ApiResponse(500, null, "Failed to fetch comments")
      );
    }
  });
  



const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment
    const { content } = req.body;
    const owner = req.user._id; 
    const {videoId} = req.params;

    try {
        const comment = await Comment.create({
            content,
            video: videoId,
            owner
        });

        return res
            .status(201)
            .json(new ApiResponse(201, comment, "Comment added successfully"));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to add comment"));
    }
});


const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {content} = req.body;
    const owner = req.user._id; 
    const {commentId} = req.params;
    try {
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: commentId, owner }, // Match the comment by its `_id` and the owner's ID
            { $set: { content } }, 
            { new: true } 
        );

        if (!updatedComment) {
            return res.status(404).json(new ApiResponse(404, null, "Comment not found or not authorized"));
        }

        return res
        .status(201)
        .json(new ApiResponse(201, updatedComment, "Comment Updated Successfully"))
    } catch (error) {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to update comment"));
    }
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    try {
        const owner = req.user._id; 
        const {commentId} = req.params;
        const result = await Comment.deleteOne({ _id: commentId, owner });
    
        if (result.deletedCount === 0) {
            return res.status(404).json(new ApiResponse(404, null, "Comment not found or not authorized"));
        }
        
        return res.status(200)
        .json(new ApiResponse(200, null, "Comment deleted successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to delete comment"));
    }

})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
    }