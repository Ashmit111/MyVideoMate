import React from "react";

const Sidebar = ({ video }) => {
   
  return (
    <div className="flex gap-4 items-start hover:bg-gray-700 p-3 rounded-lg transition">
      {/* Thumbnail */}
      <div className="relative w-40 h-24 flex-shrink-0">
        <img
          src={video.thumbnail}
          alt="thumbnail"
          className="w-full h-full rounded-lg object-cover"
        />
        <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-[11px] px-2 rounded-3xl">
          {video.formattedDuration}
        </span>
      </div>

      {/* Video Details */}
      <div>
        <h4 className="font-semibold text-white">{video.title}</h4>
        <div className="flex items-center gap-2 mt-2">
          {/* Owner Avatar */}
          <img
            src={video.owner.avatar}
            alt={video.owner.username}
            className="w-6 h-6 rounded-full object-cover"
          />
          {/* Owner Username */}
          <p className="text-gray-400 text-sm">{video.owner.username}</p>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          {video.views} Views • {video?.createdAt}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
