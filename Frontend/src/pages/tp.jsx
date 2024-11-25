import React, { useState } from "react";
import { BsYoutube } from "react-icons/bs";
import { FiMenu, FiSearch } from "react-icons/fi";
import { RiVideoAddLine, RiNotification3Line } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import { FaHistory, FaHome, FaRegCompass, FaUserCircle } from "react-icons/fa";
import { MdSubscriptions, MdVideoLibrary } from "react-icons/md";

const YoutubeNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = [
    "React tutorials",
    "Web development",
    "JavaScript basics",
    "CSS tricks",
    "HTML5 features"
  ];

  const navItems = [
    { icon: <FaHome className="w-6 h-6" />, label: "Home" },
    { icon: <FaRegCompass className="w-6 h-6" />, label: "Explore" },
    { icon: <MdSubscriptions className="w-6 h-6" />, label: "Subscriptions" },
    { icon: <MdVideoLibrary className="w-6 h-6" />, label: "Library" },
    { icon: <FaHistory className="w-6 h-6" />, label: "History" }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError("Please enter a search term");
      return;
    }
    setIsLoading(true);
    setSearchError("");
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Toggle sidebar"
              >
                <FiMenu className="h-6 w-6 text-white" />
              </button>
              <div className="hidden md:flex items-center ml-4">
                <BsYoutube className="h-8 w-8 text-red-600" />
                <span className="ml-2 font-semibold text-xl text-white">YouTube</span>
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full px-4 py-2 rounded-l-full bg-gray-700 border ${searchError ? "border-red-500" : "border-gray-600"} focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400`}
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gray-700 border border-l-0 border-gray-600 rounded-r-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Submit search"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-500 border-t-red-500 rounded-full animate-spin"></div>
                    ) : (
                      <FiSearch className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
                {searchError && (
                  <p className="absolute text-red-500 text-sm mt-1">{searchError}</p>
                )}
                {searchQuery && !searchError && (
                  <div className="absolute w-full bg-gray-800 mt-1 rounded-md shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                        onClick={() => setSearchQuery(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Create video"
              >
                <RiVideoAddLine className="h-6 w-6 text-white" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Notifications"
              >
                <RiNotification3Line className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} w-64 bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="h-full flex flex-col">
          <div className="flex flex-col items-center justify-center py-6 border-b border-gray-700">
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <FaUserCircle className="absolute inset-0 w-full h-full text-gray-400" />
            </div>
            <h3 className="mt-2 font-medium text-white">John Doe</h3>
            <p className="text-sm text-gray-400">john.doe@example.com</p>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition-colors duration-200"
                aria-label={item.label}
              >
                {item.icon}
                <span className="ml-4">{item.label}</span>
              </button>
            ))}
          </div>
          <button
            className="flex items-center px-6 py-4 bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Logout"
          >
            <BiLogOut className="w-6 h-6" />
            <span className="ml-4">Logout</span>
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        </div>
      </main>
    </div>
  );
};

export default YoutubeNavbar;