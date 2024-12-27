import React from 'react';

const VideoCard2 = ({ video }) => {
    return (
      <div className="w-[395px] h-36 rounded-lg shadow-lg bg-[#1e1e1e] text-white overflow-hidden cursor-pointer flex hover:bg-black">
        {/* Thumbnail */}
        <div className="relative h-40">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-auto h-36 object-cover"
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
                    <p className='text-[10px]'>{video.description}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">
                    {video.views} views 
                    {/* {video.timeAgo} */}
                    </p>
                </div>
                <div className='flex gap-2'>
                    <img
                    src={video.owner.avatar}
                    alt={video.owner.username}
                    className="w-9 h-9 rounded-full" />
                    <p className="text-xs text-gray-400 mt-3">
                    {video.owner.username}
                    </p>
                </div>
            </div>
      </div>
    );
  };
  

export default VideoCard2;
