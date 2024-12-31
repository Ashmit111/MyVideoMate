import React from 'react';

function ProfileVideoCard({ video }) {
  return (
    <div className="flex flex-col h-72 bg-[#1e1e1e] rounded-lg overflow-hidden shadow-lg text-white w-full max-w-sm">
      {/* Thumbnail */}
      <img
        className="w-full h-40 object-cover"
        src={video.thumbnail}
        alt={video.title}
      />

      {/* Video Info */}
      <div className="p-4">
        <h3 className="text-xl font-semibold">{video.title}</h3>
        <p className="text-sm text-gray-400 mt-2">{video.description}</p> 

        {/* Views and Likes */}
        <div className="flex gap-4 items-center mt-2 text-gray-500">
          <span>{video.likes} likes</span>
          <span>{video.views} views</span>
        </div>
      </div>
    </div>
  );
}

export default ProfileVideoCard;
