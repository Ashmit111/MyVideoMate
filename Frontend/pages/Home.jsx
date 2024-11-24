import React from 'react';
import { RiVideoAddLine, RiNotification3Line } from "react-icons/ri";
import { FiMenu, FiSearch } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { FaHistory, FaUserCircle } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary } from "react-icons/md";


const Home = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const sideItems = [
        { icon: <FaRegCompass className="w-6 h-6" />, label: "Channel" },
        { icon: <MdSubscriptions className="w-6 h-6" />, label: "Subscriptions" },
        { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists" },
        { icon: <FaHistory className='w-6 h-6'/>, label: "Watch History" } 
      ];
  return (
    <div>
      
    </div>
  )
}

export default Home
