import React, { useState, useEffect } from 'react';
import { BiSolidLike } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import axiosInstance from '@/utils/axiosInstance';

function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [subscriptionCounts, setSubscriptionCounts] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    const fetchTotalViews = async () => {
      try {
        const response = await axiosInstance.get("/users/channel-views");
        setTotalViews(response.data.data);
      } catch (error) {
        console.error("Error fetching views:", error);
      }
    };

    const fetchSubscriptionData = async () => {
      try {
        const response = await axiosInstance.get("/subscriptions/subscriberCount");
        const { subscriptionCount } = response.data.data;
        setSubscriptionCounts(subscriptionCount);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      }
    };

    const fetchTotalLikes = async () => {
      try {
        const response = await axiosInstance.get("/users/channel-likes");
        setTotalLikes(response.data.totalLikes);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchTotalViews();
    fetchSubscriptionData();
    fetchTotalLikes();
  }, []);

  return (
    <div className="h-screen bg-black w-screen overflow-y-scroll">
      {/* Navbar */}
      <nav className="w-full fixed bg-black h-16 flex items-center z-50 border-b border-gray-600">
        <div className="flex items-center py-3">
          <div className="flex gap-2 items-center px-3 ml-2">
            <img src="./public/mytube.svg" alt="Logo" className="w-8 h-8 pt-1" />
            <h2 className="pt-1 text-lg text-white">MyTube</h2>
          </div>
        </div>
        <div className="mx-auto">
          <h2 className="text-white font-bold text-2xl pt-3 flex gap-2">
            Liked Videos <BiSolidLike className="mt-1" />
          </h2>
        </div>
      </nav>

      {/* Content Section */}
      <div className="pt-16 bg-black text-white w-full">
        {/* Header Section */}
        <header className="p-6 ">
          <h1 className="text-3xl font-bold">Welcome Back, React Patterns</h1>
          <p className="text-sm text-gray-400">Seamless Video Management, Elevated Results</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 m-10">
            <div className="p-4 bg-black rounded-lg pl-5 border border-white mx-4">
              <MdOutlineRemoveRedEye className="w-6 h-6 text-white mb-5" />
              <h2 className="text-md mb-1">Total Views</h2>
              <p className="text-3xl font-semibold">{totalViews}</p>
            </div>
            <div className="p-4 bg-black rounded-lg pl-5 border border-white mx-4">
              <FaRegUser className="w-6 h-6 text-white mb-5" />
              <h2 className="text-md mb-1">Total Subscribers</h2>
              <p className="text-3xl font-semibold">{subscriptionCounts}</p>
            </div>
            <div className="p-4 bg-black rounded-lg pl-5 border border-white mx-4">
              <FaRegHeart className="w-6 h-6 text-white mb-5" />
              <h2 className="text-md mb-1">Total Likes</h2>
              <p className="text-3xl font-semibold">{totalLikes}</p>
            </div>
          </div>
        </header>

        {/* Video Table */}
        <section className="mt-8 px-6">
          <div className="overflow-x-auto">
            <table className="w-full bg-black">
              <thead>
                <tr className="text-left border-b border-gray-600">
                  <th className="p-4">Uploaded</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Date Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {/* Uncomment and use when video data is available */}
                {/* {videos.map((video, index) => (
                  <tr key={index} className="border-b border-gray-600">
                    <td className="p-4 flex items-center">
                      <img
                        src={video.thumbnail}
                        alt="thumbnail"
                        className="w-12 h-12 object-cover mr-4 rounded-md"
                      />
                      <span>{video.title}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-green-600 py-1 px-3 rounded-full">
                        {video.likes} likes
                      </span>
                    </td>
                    <td className="p-4">{video.date || "00"}</td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
