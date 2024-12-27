import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiThumbsUp } from "react-icons/fi";
import { BiSolidLike } from "react-icons/bi";
import { MdPlaylistAddCircle } from "react-icons/md";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import axiosInstance from "@/utils/axiosInstance";

const VideoDetails = ({ video, videoId, channelId }) => {
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [likeCount, setLikeCount] = useState(video.likes || 0);
  const [subscriptionCounts, setSubscriptionCounts] = useState(0); 
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylist = async () =>{
    const response = await axiosInstance.get('/playlist');
    console.log(response.data);
    setPlaylists(response.data.data);
}
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const response = await axiosInstance.get(`/likes/toggle/v/${videoId}`);
        const { likeCount, liked } = response.data.data;
        setLikeCount(likeCount);
        setIsLiked(liked);
      } catch (error) {
        console.error("Error fetching like data:", error);
      }
    };
    fetchLikeData();
    fetchPlaylist();
  }, [videoId]);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {  
        const response = await axiosInstance.get(`/subscriptions/c/${channelId}`);
        const { subscriptionCount, subscribed } = response.data.data; 
        setSubscriptionCounts(subscriptionCount);
        setIsSubscribed(subscribed);
      } catch (error) {
        console.log("Error fetching subscription data:", error);
      }
    };

    fetchSubscriptionData();
  }, [channelId]);

  const handleLikeToggle = async () => {
    try {
      const response = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
      const { liked, likeCount: updatedLikeCount } = response.data.data;

      // Update state based on API response
      setIsLiked(liked);
      setLikeCount(updatedLikeCount);
    } catch (error) {
      console.error("Error toggling like:", error.response?.data || error.message);
    }
  };

  const handleSubscriptionToggle = async () => {
    try {
      const response = await axiosInstance.post(`/subscriptions/c/${channelId}`);
      const { subscriptionCount, subscribed } = response.data.data; 
      setSubscriptionCounts(subscriptionCount);
      setIsSubscribed(subscribed);
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  return (
    <div className="p-4 bg-[#181818] rounded-lg mb-2 text-white">
      {/* Video Title */}
      <h1 className="text-xl font-bold">{video.title}</h1>

      {/* Views and Upload Time */}
      <div className="flex justify-between text-sm text-gray-400">
        <span>
          {video.views} Views • {video.uploadedTime || "2 Months ago"}
        </span>
      </div>

      {/* Channel and Actions */}
      <div className="flex items-center gap-4 mb-1">
        <img
          src={video.avatar}
          alt="channel avatar"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">{video.username}</h2>
          <p className="text-sm text-gray-400">
            {subscriptionCounts} {subscriptionCounts === 1 ? "Subscriber" : "Subscribers"} 
          </p>
        </div>

        {/* Like, Save, and Subscribe Buttons */}
        <div className="flex flex-col items-end ml-auto gap-2">
          <div className="flex gap-4 mb-2 -mt-5">
            {/* Like Button */}
            <button
              onClick={handleLikeToggle}
              className="flex items-center gap-2 text-white rounded-3xl"
            >
              {isLiked ? (
                <BiSolidLike className="text-white text-xl" />
              ) : (
                <FiThumbsUp className="text-xl" />
              )}
              <span className="text-sm">{likeCount} {likeCount === 1 ? "Like" : "Likes"}</span>
            </button>

            {/* Save Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-gray-400 transition-all rounded-3xl"
            >
              <MdPlaylistAddCircle className="text-2xl" />
              <span className="text-sm">Save</span>
            </button>
          </div>

          {/* Subscribe Button */}
          <motion.button
            onClick={handleSubscriptionToggle}
            whileTap={{ scale: 0.9 }}
            className={`px-4 py-2 rounded-3xl mb-2 transition-all ${
              isSubscribed ? "bg-gray-800 text-white " : "bg-[#f86a6b]"
            }`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </motion.button>
        </div>
      </div>
      <hr />

      {/* Video Description */}
      <div className="mt-1 p-4 text-gray-300">
        <p>{video.description}</p>
      </div>

      {/* Save to Playlist Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-[#181818] p-6 rounded-lg w-[400px] relative">
            <h3 className="text-lg font-semibold mb-4">Save to Playlist</h3>
            <MdClose
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-300 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            />
            <ul>
              {playlists.map((playlist ) => (
                <li
                  key={playlist._id}
                  className="p-2 hover:bg-[#282828] rounded-lg cursor-pointer"
                >
                  {playlist.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDetails;
