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
    </div>
  )
}

export default Dashboard
