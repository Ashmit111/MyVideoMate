import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { formatDistanceToNowStrict } from 'date-fns';
import fs from 'fs'
 
const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    console.log(req.files);

    const avatarFile = req.files?.avatar?.[0];
    const coverImageFile = req.files?.coverImage?.[0];

    if (!avatarFile) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = avatarFile
        ? await uploadOnCloudinary(avatarFile.buffer)
        : null;

    const coverImage = coverImageFile
        ? await uploadOnCloudinary(coverImageFile.buffer)
        : null;


    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
 
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, password} = req.body
    console.log(email);

    if ( !email) {
        throw new ApiError(400, "Email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{email}]
    })

    if (!user) {
        console.log("User does not exist");
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    console.log(loggedInUser);
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body
 
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {username} = req.body
    console.log(username);
    if ( !username) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { 
                username: username?.toLowerCase()
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    try {
        // Access uploaded avatar file from Multer's memory storage
        const avatarFile = req.file;

        if (!avatarFile) {
            throw new ApiError(400, "Avatar file is missing");
        }

        // Retrieve the user and check for an existing avatar URL
        const oldUser = await User.findById(req.user?._id);
        if (!oldUser) {
            throw new ApiError(404, "User not found");
        }

        const oldAvatarUrl = oldUser.avatar;

        // Delete old avatar from Cloudinary if it exists
        if (oldAvatarUrl) {
            await deleteFromCloudinary(oldAvatarUrl); // Ensure this function is implemented
        }

        // Upload the new avatar to Cloudinary
        const avatar = await uploadOnCloudinary(avatarFile.buffer);

        if (!avatar?.url) {
            throw new ApiError(500, "Error while uploading avatar");
        }

        // Update user document with the new avatar URL
        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            { $set: { avatar: avatar.url } },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            throw new ApiError(500, "Failed to update user avatar");
        }

        // Respond with success
        return res.status(200).json(
            new ApiResponse(200, updatedUser, "Avatar image updated successfully")
        );
    } catch (error) {
        console.error("Error updating user avatar:", error);
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to update avatar image")
        );
    }
});


const updateUserCoverImage = asyncHandler(async (req, res) => {
    try {
        // Access uploaded cover image file from Multer's memory storage
        const coverImageFile = req.file;

        if (!coverImageFile) {
            throw new ApiError(400, "Cover image file is missing");
        }

        // Retrieve the user and check for an existing cover image URL
        const oldUser = await User.findById(req.user?._id);
        if (!oldUser) {
            throw new ApiError(404, "User not found");
        }

        const oldCoverImageUrl = oldUser.coverImage;

        // Delete old cover image from Cloudinary if it exists
        if (oldCoverImageUrl) {
            await deleteFromCloudinary(oldCoverImageUrl); // Ensure this function is implemented
        }

        // Upload the new cover image to Cloudinary
        const coverImage = await uploadOnCloudinary(coverImageFile.buffer);

        if (!coverImage?.url) {
            throw new ApiError(500, "Error while uploading cover image");
        }

        // Update user document with the new cover image URL
        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            { $set: { coverImage: coverImage.url } },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            throw new ApiError(500, "Failed to update cover image");
        }

        // Respond with success
        return res.status(200).json(
            new ApiResponse(200, updatedUser, "Cover image updated successfully")
        );
    } catch (error) {
        console.error("Error updating cover image:", error);
        return res.status(500).json(
            new ApiResponse(500, null, "Failed to update cover image")
        );
    }
});



const getUserChannelProfile = asyncHandler(async(req, res) => {
    try {
        const { channelId } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
          return res.status(400).json(
            new ApiResponse(400, null, "Invalid Channel ID")
          );
        }
    
        const channel = await User.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(channelId),
            },
          },
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $addFields: {
              subscribersCount: { $size: "$subscribers" },
              isSubscribed: {
                $cond: {
                  if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
              subscribersCount: 1,
              coverImage: 1,
            },
          },
        ]);
    
        if (!channel.length) {
          return res.status(404).json(
            new ApiResponse(404, null, "Channel does not exist")
          );
        }
    
        return res.status(200).json(
          new ApiResponse(200, channel[0], "Channel profile fetched successfully")
        );
      } catch (error) {
        console.error("Error fetching channel profile:", error);
        return res.status(500).json(
          new ApiResponse(500, null, "Failed to fetch channel profile")
        );
      }
    }); 

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
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
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    const formattedWatchHistory = user[0].watchHistory.map(video => ({
        ...video,
        createdAt: formatDistanceToNowStrict(new Date(video.createdAt), { addSuffix: true })
      }));

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            formattedWatchHistory,
            "Watch history fetched successfully"
        )
    )
})

const getChannelViews = asyncHandler(async (req, res) => {
    const channelId = req.user._id; // Assuming the channel ID is the user's ID

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    const views = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId) // Match videos owned by the user
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" } // Sum all the views
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            views[0]?.totalViews || 0, // Return total views or 0 if no videos
            "Channel views fetched successfully"
        )
    );
});

const getChannelLikes = asyncHandler(async (req, res) => {
    const channelId = req.user._id;

  // Validate channelId
  if (!channelId) {
    throw new ApiError(400, "Channel ID is required");
  }

  try {
    // Find all videos by the channel
    const videos = await Video.find({ owner: channelId });

    // Extract video IDs
    const videoIds = videos.map(video => video._id);

    // Find all likes for the videos
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

    res.status(200).json({ totalLikes });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching likes", error: error.message });
  }
});

const getUserProfileWithVideos = asyncHandler(async (req, res) => {
    const userId = req.params.channelId || req.user._id;
  
    // Validate userId
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }
  
    try {
      // Find the user
      const user = await User.findById(userId).select("username");
  
      if (!user) {
        throw new ApiError(404, "User not found");
      }
  
      // Find all videos by the user
      const videos = await Video.find({ owner: userId }).select("thumbnail title description views createdAt");
  
      // Get likes for each video
      const videosWithLikes = await Promise.all(videos.map(async (video) => {
        const likesCount = await Like.countDocuments({ video: video._id });
        return {
          ...video.toObject(),
          likes: likesCount,
          createdAt: formatDistanceToNowStrict(new Date(video.createdAt), { addSuffix: true })
        };
      }));
  
      res.status(200).json({
        username: user.username,
        videos: videosWithLikes
      });
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching user profile and videos", error: error.message });
    }
  });


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    getChannelViews,
    getChannelLikes,
    getUserProfileWithVideos
}