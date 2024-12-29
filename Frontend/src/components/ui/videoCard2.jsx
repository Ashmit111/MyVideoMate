import React from 'react';
import { MdDelete } from 'react-icons/md';
import axiosInstance from '@/utils/axiosInstance';
import { showEmojiToast, showErrorToast } from '@/utils/toastNotification';

const VideoCard2 = ({ video, playlistId = null, videoId = null, onPlaylistCreated=null }) => {
  const handleDelete = async (event) => {
    event.preventDefault()
    try {
      console.log('Removing video from playlist:', videoId, playlistId);
      
      const response = await axiosInstance.patch(`/playlist/remove/${videoId}/${playlistId}`);
      console.log(response.data);
      showEmojiToast('Video removed from playlist successfully', '✂️');
      onPlaylistCreated();
    } catch (error) {
      showErrorToast('Failed to remove video from playlist');
    }
  };

  return (
    <div className="w-[445px] h-40 rounded-lg shadow-lg bg-[#1e1e1e] text-white overflow-hidden cursor-pointer flex hover:bg-black mb-4 relative">
      {/* Thumbnail */}
      <div className="relative h-40">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-52 h-full object-cover"
        />
        <span className="absolute bottom-3 right-2 bg-black bg-opacity-75 text-xs px-2 py-1 rounded-md">
          {video.formattedDuration}
        </span>
      </div>

      {/* Video Info */}
      <div className="flex-1 flex-col space-y-4 py-4 px-3">
        <div>
          <h3 className="text-sm font-semibold line-clamp-2">
            {video.title}
          </h3>
          <p className="text-[10px]">{video.description}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">
            {video.views} views {video.createdAt}
          </p>
        </div>
        <div className="flex gap-2">
          <img
            src={video.owner.avatar}
            alt={video.owner.username}
            className="w-9 h-9 rounded-full"
          />
          <p className="text-xs text-gray-400 mt-3">
            {video.owner.username}
          </p>
        </div>
      </div>

      {/* Delete Button */}
      {playlistId && videoId && (
        <button
          className="absolute right-2 bottom-2 text-right bg-transparent text-white py-1 px-1 focus:outline-none hover:border-transparent hover:text-gray-400"
          onClick={handleDelete}
        >
          <MdDelete className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default VideoCard2;
