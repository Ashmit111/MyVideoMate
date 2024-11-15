import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;
    const owner = req.user._id; 

    if (!content || content.trim() === "") {
        return res.status(400).json(new ApiResponse(400, null, "Content is required"));
    }
    
    const tweet = await Tweet.create({content,owner});
    return res.status(200).json(new ApiResponse(200, tweet, "Tweet Added successfully"));
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    try {
        const { userId } = req.params;
        const alltweets = await Tweet.find({owner: userId});
    
        if (alltweets.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "No tweets found for this user"));
        }
        return res.status(200).json(new ApiResponse(200, alltweets, "Tweets fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error fetching tweets: ${error.message}`));
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    try {
        const { tweetId } = req.params;
        const {content} = req.body;
        const owner = req.user._id; 

        if (!content || content.trim() === "") {
            return res.status(400).json(new ApiResponse(400, null, "Content is required"));
        }

        const updatedTweet = await Tweet.findByIdAndUpdate(
            {_id: tweetId,owner},
            { $set: { content } },
            {new: true}
        )

        if (!updatedTweet) {
            return res.status(404).json(new ApiResponse(404, null, "Tweet not found or not authorized"));
        }

        return res
        .status(200)
        .json(new ApiResponse(200, updatedTweet, "Tweet Updated Successfully"))
    } catch (error) {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to update tweet"));
    }
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    try {
        const owner = req.user._id; 
        const {tweetId} = req.params;
        const result = await Tweet.deleteOne({ _id: tweetId, owner });
    
        if (result.deletedCount === 0) {
            return res.status(404).json(new ApiResponse(404, null, "Tweeet not found or not authorized"));
        }
        
        return res.status(200)
        .json(new ApiResponse(200, null, "Tweet deleted successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to delete tweet"));
    }
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
