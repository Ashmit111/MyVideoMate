import React from 'react';
import { RiVideoAddLine, RiNotification3Line } from "react-icons/ri";
import { FiMenu, FiSearch } from "react-icons/fi";
import { BiLogOut, BiSolidLike } from "react-icons/bi";
import { FaHistory  } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary } from "react-icons/md";
import { IoSettings } from "react-icons/io5";



const Home = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const sideItems = [
        { icon: <BiSolidLike className="w-6 h-6" />, label: "Liked Videos" },
        { icon: <FaRegCompass className="w-6 h-6" />, label: "My Channel" },
        { icon: <MdSubscriptions className="w-6 h-6" />, label: "Subscriptions" },
        { icon: <MdVideoLibrary className="w-6 h-6" />, label: "My Playlists" },
        { icon: <FaHistory className="w-6 h-6"/>, label: "Watch History" }, 
        { icon: <IoSettings className="w-6 h-6"/>, label: "Settings"},
        { icon: <BiLogOut className="w-6 h-6" />, label: "Log Out" }
      ];
  return (
    <div>
      
    </div>
  )
}

export default Home
