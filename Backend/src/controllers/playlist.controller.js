import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    try {
        const {name, description} = req.body
        const owner = req.user._id
        const playlist = await Playlist.create({name,description,owner})
        return res.status(200).json(new ApiResponse(200, playlist, "Playlist created successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error creating Playlist: ${error.message}`));
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    try {
        const {userId} = req.params
        const userPlaylist = await Playlist.find({owner:userId}).populate("videos");
        if (userPlaylist.length === 0) {
            return res.status(200).json(new ApiResponse(200, [], "No playlists found for this user"));
        }
        return res.status(200).json(new ApiResponse(200, userPlaylist, "Playlist fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error getting Playlist: ${error.message}`));
    }
    
})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    try {
        const {playlistId} = req.params;

        if (!mongoose.isValidObjectId(playlistId)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid playlist ID format"));
        }
        
        const playlistById = await Playlist.findOne({_id:playlistId}).populate("videos");

        if (!playlistById) {
            return res.status(404).json(new ApiResponse(404, null, "Playlist not found"));
        }

        return res.status(200).json(new ApiResponse(200, playlistById, "Playlist fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error getting Playlist: ${error.message}`));
    }
    
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    try {
        const {playlistId, videoId} = req.params;
        const owner = req.user._id; 
        const addVideo = await Playlist.findOneAndUpdate(
            {_id: playlistId,owner},
            {$addToSet: {videos: videoId}},
            {new: true}
        )

        if (!addVideo) {
            return res.status(404).json(new ApiResponse(404, null, "Failed to Add Video to Playlist"));
        }

        return res.status(200).json(new ApiResponse(200, addVideo, "Video Added to Playlist successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error adding video to Playlist: ${error.message}`));
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // TODO: remove video from playlist
    try {
        const {playlistId, videoId} = req.params;
        const owner = req.user._id;
        const removeVideo = await Playlist.findOneAndUpdate(
            {_id: playlistId,owner},
            {$pull: {videos: videoId}},
            {new: true}
        )

        if (!removeVideo) {
            return res.status(404).json(new ApiResponse(404, null, "Failed to Remove Video from Playlist"));
        }
        return res.status(200).json(new ApiResponse(200, addVideo, "Video Removed from Playlist successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, `Error removing video from Playlist: ${error.message}`));
    }

})

const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist
    try {
        const {playlistId} = req.params;
        const owner = req.user._id;
        const deletedPlaylist = await Playlist.deleteOne({_id: playlistId,owner});

        if(deletedPlaylist.deletedCount === 0){
            return res.status(404).json(new ApiResponse(404, null, "Playlist not found or not authorized"));
        }

        return res.status(200).json(new ApiResponse(200, null, "Playlist deleted successfully"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to delete playlist"));
    }
    
})

const updatePlaylist = asyncHandler(async (req, res) => {
    //TODO: update playlist
    try {
        const {playlistId} = req.params
        const owner = req.user._id;
        const {name, description} = req.body
        const updatedPlaylist = await Playlist.findOneAndUpdate(
            {_id: playlistId,owner},
            {$set : {name, description}},
            {new: true}
        )

        if (!updatedPlaylist) {
            return res.status(404).json(new ApiResponse(404, null, "Playlist not found or not authorized"));
        }

        return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Playlist Updated Successfully"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to update playlist"));
    }
    
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
