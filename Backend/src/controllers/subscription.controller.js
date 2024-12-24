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
    try {
        const {channelId} = req.params;
        
        if (!isValidObjectId(channelId)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid channel ID"));
        }

        const subscribers = await Subscription.find({channel: channelId}).populate("subscriber");

        if (subscribers.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "No subscribers found for this channel"));
        } 

        return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error fetching subscribers: ${error.message}`));
    }
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    try {
        const { subscriberId } = req.params;

        if (!isValidObjectId(subscriberId)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid Subscriber ID"));
        }
        
        const subscribedChannels = await Subscription.find({subscriber: subscriberId}).populate("channel");

        if (subscribedChannels.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "No subscribed channels found for this user"));
        } 

        return res.status(200).json(new ApiResponse(200, subscribedChannels, "Subscribers fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error fetching subscribers: ${error.message}`));
    }
})

export {
    toggleAndGetSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}