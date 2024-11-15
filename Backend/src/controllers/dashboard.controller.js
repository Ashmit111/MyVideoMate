import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const channelId = req.user._id;

    try {
        // Total Views
        const totalViews = await Video.aggregate([
            {
                $match: { owner: new mongoose.Types.ObjectId(channelId) }
            },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" }
                }
            }
        ]);

        const totalViewsCount = totalViews.length ? totalViews[0].totalViews : 0;

        // Total Subscribers
        const totalSub = await Subscription.aggregate([
            {
                $match: { channel: new mongoose.Types.ObjectId(channelId) } // Match by channel
            },
            {
                $count: "totalSub" // Count the number of subscribers
            }
        ]);

        const totalSubCount = totalSub.length ? totalSub[0].totalSub : 0;

        // Total Videos
        const totalVideos = await Video.aggregate([
            {
                $match: { owner: new mongoose.Types.ObjectId(channelId) }
            },
            {
                $count: "totalVideos"
            }
        ]);

        const totalVideosCount = totalVideos.length ? totalVideos[0].totalVideos : 0;

        // Total Likes
        const totalLikes = await Like.aggregate([
            {
                $match: {
                    video: {
                        $in: await Video.find({ owner: new mongoose.Types.ObjectId(channelId) }).distinct('_id') // Get all video IDs for the channel
                    }
                }
            },
            {
                $count: "totalLikes"
            }
        ]);

        const totalLikesCount = totalLikes.length ? totalLikes[0].totalLikes : 0;

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    totalVideosCount,
                    totalSubCount,
                    totalViewsCount,
                    totalLikesCount
                },
                "Statistics fetched successfully"
            )
        );
    } catch (error) {
        console.error("Error fetching stats:", error);
        return res.status(500).json(
            new ApiResponse(
                500,
                null,
                "Failed to fetch statistics"
            )
        );
    }
});


const getChannelVideos = asyncHandler(async (req, res) => {
    const ownerId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    try {
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { createdAt: -1 } // recent videos first
        };

        // Define the aggregate query to find videos
        const videoQuery = Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(ownerId),
                    isPublished: true
                }
            }
        ]);

        // Use aggregatePaginate to fetch paginated results
        const allVideos = await Video.aggregatePaginate(videoQuery, options);

        if (!allVideos?.length) {
            throw new ApiError(404, "videos does not exists")
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                allVideos.docs,
                "Videos fetched successfully"
            )
        );
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(
                500,
                null,
                "Failed to fetch videos"
            )
        );
    }
});


export {
    getChannelStats, 
    getChannelVideos
    }