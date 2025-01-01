import React from 'react'
 
const AudienceCard = ({ user, totalVideos }) => {

  console.log(user);
   
  return (
  
    <div className="flex justify-between items-center p-4 border border-gray-300 rounded-md shadow-sm w-80">
      {/* Left side: Avatar and Username */}
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="font-medium text-lg text-white">{user.username}</span>
      </div>
  
      {/* Right side: Total Videos */}
      <div>
        <span className="text-gray-600">Total Videos: {totalVideos}</span>
      </div>
    </div>
  )}; 
export default AudienceCard
