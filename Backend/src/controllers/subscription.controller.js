import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleAndGetSubscription = asyncHandler(async (req, res) => {
    try {
      const channelId = req.params.channelId || req.user._id;

      const userId = req.user._id; // Assuming you have the user in req.user from authentication
  
      if (!isValidObjectId(channelId)) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid channel ID"));
      }
   
      if (req.method === "POST") {
        const existingSubs = await Subscription.findOne({ channel: channelId, subscriber: userId });
  
        if (existingSubs) {
          await Subscription.findByIdAndDelete(existingSubs._id); // Remove subscription
          return res.status(200).json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"));
        } else {
          await Subscription.create({ channel: channelId, subscriber: userId }); // Add subscription
          return res.status(200).json(new ApiResponse(200, { subscribed: true }, "Subscribed successfully"));
        }
      }
   
      if (req.method === "GET") {
        const subscriptionCount = await Subscription.countDocuments({ channel: channelId });
        const isSubscribed = await Subscription.findOne({ channel: channelId, subscriber: userId });
  
        return res.status(200).json(
          new ApiResponse(200, { subscriptionCount, subscribed: !!isSubscribed }, "Subscription data fetched successfully")
        );
      }
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, null, `Error: ${error.message}`));
    }
  });

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const userId = req.params.channelId || req.user._id;

  // Validate userId
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  try {
    // Aggregate to get subscribers and their total videos
    const subscribers = await Subscription.aggregate([
      { $match: { channel: userId } },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscriberDetails",
        },
      },
      { $unwind: "$subscriberDetails" },
      {
        $lookup: {
          from: "videos",
          localField: "subscriber",
          foreignField: "owner",
          as: "videos",
        },
      },
      {
        $addFields: {
          totalVideos: { $size: "$videos" },
        },
      },
      {
        $project: {
          "subscriberDetails.username": 1, 
          "subscriberDetails.avatar": 1,
          totalVideos: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Subscribers fetched successfully",
      data: subscribers,
    });
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error fetching subscribers: ${error.message}`));
    }
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Validate userId
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  try {
    // Aggregate to get subscribed channels and their total videos
    const subscribedChannels = await Subscription.aggregate([
      { $match: { subscriber: userId } },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "channelDetails",
        },
      },
      { $unwind: "$channelDetails" },
      {
        $lookup: {
          from: "videos",
          localField: "channel",
          foreignField: "owner",
          as: "videos",
        },
      },
      {
        $addFields: {
          totalVideos: { $size: "$videos" },
        },
      },
      {
        $project: {
          "channelDetails.username": 1, 
          "channelDetails.avatar": 1,
          totalVideos: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Subscribed channels fetched successfully",
      data: subscribedChannels,
    });
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error fetching subscribers: ${error.message}`));
    }
})

export {
    toggleAndGetSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}