import React from 'react';
import { useState, useEffect } from 'react'; 
import { BiLogOut, BiLike, BiSolidLike } from "react-icons/bi";
import { FaHistory, FaRegCompass,  } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary,  } from "react-icons/md";
import { IoSettings } from "react-icons/io5";  
import VideoCard from '@/components/ui/videoCard';
import { Link } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';

function Dashboard() {
  return (
    <div className='h-screen bg-black w-full overflow-y-scroll'>
        <nav className='w-full fixed bg-black h-16 flex items-center z-50 border-b border-gray-600'>
              <div className='flex items-center py-3'>
                <div className="flex gap-2 items-center px-3 ml-2">
                  <img src="./public/mytube.svg" alt="Logo" className='w-8 h-8 pt-1'/>
                  <h2 className='pt-1 text-lg text-white'>MyTube</h2>
                </div>
              </div>
               <div className='mx-auto'>
                  <h2 className='text-white font-bold text-2xl pt-3 flex gap-2'>Liked Videos  <BiSolidLike className='mt-1'/></h2>
               </div>
        </nav>
        <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <header className="p-6 text-center">
        <h1 className="text-3xl font-bold">Welcome Back, React Patterns</h1>
        <p className="text-sm text-gray-400">Seamless Video Management, Elevated Results</p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h2 className="text-lg">Total Views</h2>
            <p className="text-2xl font-bold">221,234</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h2 className="text-lg">Total Subscribers</h2>
            <p className="text-2xl font-bold">4,053</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h2 className="text-lg">Total Likes</h2>
            <p className="text-2xl font-bold">63,021</p>
          </div>
        </div>
      </header>

      {/* Video Table */}
      <section className="mt-8 px-6">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800">
            <thead>
              <tr className="text-left border-b border-gray-600">
                <th className="p-4">Uploaded</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Date Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video, index) => (
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
                  <td className="p-4">{video.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
    </div>
  )
}

export default Dashboard
