import React from "react";

const Sidebar = ({ videos }) => {
    return (
      <div className="flex flex-col gap-4">
        {videos.map((video) => (
          <div key={video.id} className="flex gap-4 items-start">
            <img
              src={video.thumbnail}
              alt="thumbnail"
              className="w-40 h-24 rounded-lg object-cover"
            />
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
  