import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    //Custom aggregation pipeline approach
    //Can also be done with mongooseAggregatePaginate built in best approach
    //Check dasboard for reference 
    const { videoId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    try {
        const comment = await Video.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "content",
                    as: "allcomments",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                owner: { $first: "$owner" }
                            }
                        }
                    ]
                }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                comment[0]?.allcomments || [],
                "Comments fetched successfully"
            )
        );
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(
                500,
                null,
                "Failed to fetch comments"
            )
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