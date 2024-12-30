import React from 'react'; 
import { BiLogOut, BiLike } from "react-icons/bi";
import { FaHistory, FaRegCompass   } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary  } from "react-icons/md";
import { IoSettings } from "react-icons/io5";     
import { useNavigate } from 'react-router-dom';  
import axiosInstance from '@/utils/axiosInstance';
import { logout } from '@/Features/authSlice';
import { useDispatch } from 'react-redux';
function Sidebar() {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const sideItems = [
          { icon: <BiLike className="w-6 h-6" />, label: "Liked Videos", path: '/likedVideos' },
          { icon: <FaRegCompass className="w-6 h-6" />, label: "My Channel", path: '/dashboard' },
          { icon: <MdSubscriptions className="w-6 h-6" />, label: "Audience", path: '/audience' },
          { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists", path: '/myplaylist' },
          { icon: <FaHistory className="w-6 h-6"/>, label: "Watch History", path: '/watchHistory' }, 
          { icon: <IoSettings className="w-6 h-6"/>, label: "Settings", path: '/settings'} 
        ];

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post('/users/logout');
            console.log(response.data);
            localStorage.removeItem('accessToken');
            dispatch(logout());
            navigate('/'); // Navigate to login page after logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
  return (
    < >
      <div>
                  {sideItems.map((item, index) => (
                    <button
                      key={index}
                      className="w-full flex cursor-pointer items-center px-8 py-3 text-white bg-transparent outline-none border-none focus:outline-none focus:bg-[#1e1e1e] focus:ring-0 hover:bg-[#1e1e1e]"
                      aria-label={item.label}
                      onClick={() => navigate(item.path)}
                    >
                      {React.cloneElement(item.icon, { className: 'h-5 w-5 text-white' })}
                      <span className="ml-4 text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-auto mb-2">
                  <button
                    className="w-full flex items-center cursor-pointer px-8 py-3 text-white bg-transparent outline-none border-none focus:outline-none focus:ring-0 hover:bg-[#1e1e1e] focus:bg-[#1e1e1e]"
                    aria-label="Log Out"
                    onClick={handleLogout}
                  >
                    <BiLogOut className="h-5 w-5 text-red" />
                    <span className="ml-4 text-sm">Log Out</span>
                  </button>
                </div>
    </>
  )
}

export default Sidebar
