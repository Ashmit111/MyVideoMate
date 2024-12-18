import React from 'react';

const VideoCard3 = ({ video }) => {
    return (
      <div className="w-full h-64 rounded-xl shadow-lg bg-black text-white overflow-hidden cursor-pointer flex hover:bg-[#1e1e1e]">
        {/* Thumbnail */}
        <div className="relative h-64">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-auto h-64 object-cover"
          />
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-xs px-2 pb-1  rounded-md">
            {video.formattedDuration}
          </span>
        </div>
  
        {/* Video Info */}
            <div className="flex-1 flex-col space-y-3 py-4 px-3">
                <div>
                    <h3 className="text-lg font-semibold line-clamp-2 pl-5">
                    {video.title}
                    </h3>
                </div>
                <div>
                    <p className="text-base text-gray-400 pt-2 pl-5">
                    {video.views} views • 2 Month Ago 
                    {/* {video.timeAgo} */}
                    </p>
                </div>
                <div className='flex gap-4 pt-4 pl-5'>
                    <img
                    src={video.owner.avatar}
                    alt={video.owner.username}
                    className="w-10 h-10 rounded-full " />
                    <p className="text-lg text-gray-400 mt-1 ">
                    {video.owner.username}
                    </p>
                </div>
                <div className='pt-4 pl-5'>
                    <p className='text-sm'>
                    {video.description}</p>
                </div>
            </div>
      </div>
    );
  };
  

export default VideoCard3;
