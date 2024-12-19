import React from "react";

const VideoPlayer = ({ videoUrl }) => {
    return (
      <div className="w-full aspect-video mb-4">
        <video
          className="w-full h-full rounded-lg"
          controls
          src={videoUrl || "https://videos.pexels.com/video-files/27857022/12245086_2560_1440_60fps.mp4"}
          poster="https://via.placeholder.com/800x450"
        ></video>
      </div>
    );
  };
  
  export default VideoPlayer;
  