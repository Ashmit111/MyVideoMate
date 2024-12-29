import React from 'react';
import { useState } from 'react';
import { MdDelete,MdEdit } from 'react-icons/md';
import axiosInstance from '@/utils/axiosInstance';
import { showErrorToast, showSuccessToast } from '@/utils/toastNotification';
import CreatePlaylistModal from './CreatePlaylistModal';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PlaylistCard = ({ playlist, bgColor, onPlaylistCreated  }) => {
  const image = 'https://imgs.search.brave.com/K0FWPeLcYsy2P7eV2k7dvd_3YcG7fNkr3OSCjeO4fqc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvbS82/MmQxMGJjZjlkYjNk/ZDI5ZTVmZGJiMmUv/NjYwYmJmMTU0NTU3/YTgwOGU5MjQ1MGI4/X3N1bW1lci1oaXRz/LXNwb3RpZnktcGxh/eWxpc3QtbWluLmpw/ZWc';
  const [modal, setModal] = useState(false);
  const { playlistId } = useParams();
  const editModal = true;
  const navigate = useNavigate();
  const handleDelete = async () => { 
    const response = await axiosInstance.delete(`/playlist/${playlistId}`);
    if (response.status === 200) {
      showSuccessToast('Playlist deleted successfully');
      navigate('/MyPlaylist');
    } else {
      showErrorToast('Failed to delete playlist');
    }
  }  
 
  return (
    <div className={`max-w-sm h-64 rounded-lg shadow-2xl ${bgColor} text-white overflow-hidden flex flex-col cursor-pointer relative`}>
      {/* Thumbnail */}
      <div className="relative h-40">
        <img
          src={image}
          alt={playlist.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Video Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title and Details */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold line-clamp-2">
            {playlist?.name}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {playlist?.description}
          </p>
        </div>
        {/* Delete Button */}
        {playlistId && (
          <>
          <button
              className="absolute right-2 bottom-2 text-right bg-transparent pb-3 text-white py-1 px-1 focus:outline-none hover:border-transparent hover:text-gray-400"
              onClick={ () => setModal(true) }
            >
              <MdEdit className='h-5 w-5' />
            </button>
          <button className="absolute right-12 bottom-2 text-right bg-transparent pb-3 text-white py-1 px-1 focus:outline-none hover:border-transparent hover:text-gray-400"
          onClick={handleDelete}
          >
            <MdDelete className='h-5 w-5' />
          </button>
          </>
          
        )}
      </div>
      <CreatePlaylistModal
        Modal={modal} setModal={setModal} editModal={editModal} onPlaylistCreated={onPlaylistCreated} playlistId={playlistId}/>
    </div>
  );
}

export default PlaylistCard;