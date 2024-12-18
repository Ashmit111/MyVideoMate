import React from 'react';

const VideoCard = ({ video }) => {
    return (
      <div className="max-w-sm h-64 rounded-lg shadow-lg bg-black text-white overflow-hidden flex flex-col cursor-pointer hover:bg-[#1e1e1e]">
        {/* Thumbnail */}
        <div className="relative h-40">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-xs px-2 py-1 rounded-md">
            {video.formattedDuration}
          </span>
        </div>
  
        {/* Video Info */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start space-x-4">
            {/* Channel Avatar */}
            <img
              src={video.owner.avatar}
              alt={video.owner.username}
              className="w-10 h-10 rounded-full"
            />
            
            {/* Title and Details */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold line-clamp-2">
                {video.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
              {video.owner.username}
              </p>
              <p className="text-xs text-gray-400">
                {video.views} views 
                {/* • {new Date(video.createdAt).toLocaleDateString()} */}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

export default VideoCard;
