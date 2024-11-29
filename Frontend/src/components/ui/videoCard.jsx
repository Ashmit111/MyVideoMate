import React from 'react';

const VideoCard = ({ video }) => {
  return (
    <div className="max-w-sm rounded-lg shadow-lg bg-gray-800 text-white overflow-hidden">
      //Thumbnail
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-xs px-2 py-1 rounded-md">
          {video.duration}
        </span>
      </div>
      
      //Info
      <div className="p-4">
        <div className="flex items-start space-x-4"> 
          <img
            src={video.channelAvatar}
            alt={video.channelName}
            className="w-10 h-10 rounded-full"
          />
           
          <div className="flex-1">
            <h3 className="text-sm font-semibold line-clamp-2">
              {video.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {video.channelName}
            </p>
            <p className="text-xs text-gray-400">
              {video.views} views • {video.timeAgo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
