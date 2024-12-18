import React from "react";

const VideoPlayer = ({ videoUrl }) => {
    return (
      <div className="w-full aspect-video mb-4">
        <video
          className="w-full h-full rounded-lg"
          controls
          src={videoUrl}
          poster="https://via.placeholder.com/800x450"
        ></video>
      </div>
    );
  };
  
  export default VideoPlayer;
  