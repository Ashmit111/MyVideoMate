import React from "react";

const Sidebar = ({ videos }) => {
  return (
    <div className="flex flex-col gap-4">
      {videos.map((video) => (
        <div key={video.id} className="flex gap-4 items-start">
          <div className="relative w-40 h-24 flex-shrink-0">
            <img
              src={video.thumbnail}
              alt="thumbnail"
              className="w-full h-full rounded-lg object-cover"
            />
            <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-[11px] px-2 rounded-3xl">
              {video.formattedDuration || "33:23"}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-white">{video.title}</h4>
            <p className="text-gray-400 text-sm">{video.channelName}</p>
            <p className="text-gray-500 text-xs">
              {video.views} Views • {video.uploadedTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
