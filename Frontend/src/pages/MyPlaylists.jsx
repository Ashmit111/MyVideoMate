import React from 'react';
import { useState, useEffect } from 'react';  
import { MdOutlineCreateNewFolder } from "react-icons/md"; 
import PlaylistCard from '@/components/ui/playlistCard';
import axiosInstance from '@/utils/axiosInstance';
import CreatePlaylistModal from '@/components/ui/CreatePlaylistModal';
import { Link } from 'react-router-dom'; 
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';

function MyPlaylists() {
    const [isLoading, setIsLoading] = useState(false);  
    const [playlists, setPlaylists] = useState([]);
    const [modal, setModal] = useState(false);  
    const editModal = false; 

    const fetchPlaylist = async () =>{
        const response = await axiosInstance.get('/playlist');
        console.log(response.data);
        setPlaylists(response.data.data);
    }
    useEffect(() => { 
      fetchPlaylist();
    }, [setModal]);

    const onPlaylistCreated = () => {
        fetchPlaylist(); // Fetch the updated playlists
    };
  return (
    <div className='h-screen bg-black w-full overflow-y-scroll'>
      <Navbar/>
      //sidebar 
        {/* Sidebar */}
        <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4 border-r border-gray-600">
          <Sidebar/> 
        </div>
 
      {/* Main Content */}
      <div className="pl-64 pt-20 pb-8 px-4 w-[calc(100vw-17px)]">
  {/* Button to Create Playlist */}
  <div className="flex justify-end mb-4">
    <button
      className="bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
      onClick={() => setModal(true)}
    >
      <MdOutlineCreateNewFolder className="w-6 h-6" />
      <span>Create Playlist</span>
    </button>
  </div>

  {/* Playlists Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 z-0">
    {playlists.length > 0 ? (
    playlists.map((playlist) => (
      <Link to={`/playlists/${playlist._id}`} key={playlist._id}>
      <PlaylistCard
        playlist={playlist}
        bgColor="bg-[#1e1e1e]"
      />
    </Link>
    ))
    ) : (
    <div className="col-span-full text-center text-white">
      <p className="text-center text-white mt-52">No playlists available.</p>
  </div>
)}
  </div>
</div>

    {/* Modal */}
    <CreatePlaylistModal Modal={modal} setModal={setModal} onPlaylistCreated={onPlaylistCreated} editModal={editModal} />
      
    </div>
  )
}

export default MyPlaylists
