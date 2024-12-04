import React from 'react'

function PlaylistCard({ playlist, bgColor }) {
    const image = 'https://imgs.search.brave.com/K0FWPeLcYsy2P7eV2k7dvd_3YcG7fNkr3OSCjeO4fqc/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvbS82/MmQxMGJjZjlkYjNk/ZDI5ZTVmZGJiMmUv/NjYwYmJmMTU0NTU3/YTgwOGU5MjQ1MGI4/X3N1bW1lci1oaXRz/LXNwb3RpZnktcGxh/eWxpc3QtbWluLmpw/ZWc' 
    return (
        <div className={`max-w-sm h-64 rounded-lg shadow-2xl ${bgColor} text-white overflow-hidden flex flex-col cursor-pointer`}>
          {/* Thumbnail */}
          <div className="relative h-40">
            <img
              src= {image}
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
            </div>
          </div> 
      );
}

export default PlaylistCard
