import React from 'react';
import { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom'; 
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';

function Setting() {
    const [isLoading, setIsLoading] = useState(false);  
    const navigate = useNavigate(); 

    useEffect(() => {
      
    }, []);
  return (
    <div className='h-screen bg-black w-full overflow-y-scroll'>
      <Navbar/> 
      //sidebar 
        {/* Sidebar */}
        <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4 border-r border-gray-600">
          <Sidebar/> 
        </div>
 
      {/* Main Content */}
      <div className=" pl-64 pt-20 pb-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 z-0 w-[calc(100vw-17px)] ">
          <img src={user?.coverImage}  alt="coverImage" />
          <img src={user?.avatar}  alt="coverImage" />
          
          
          
          {/* {playlists.map((playlist, index) => (
            <PlaylistCard key={index} playlist={playlist} bgColor="bg-[#1e1e1e]" />
          ))} */}
     </div>
    
      
    </div>
  )
}

export default Setting
