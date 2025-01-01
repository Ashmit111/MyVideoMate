import React from 'react';
import { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom'; 
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';
import { useSelector } from 'react-redux';
import axiosInstance from '@/utils/axiosInstance';
import { useParams } from 'react-router-dom'; 
import ProfileVideoCard from '@/components/ui/profileVideoCard';

function Setting() {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('Videos');
    const [videos, setVideo] = useState([]);
    const [subscribersData, setSubscribersData] = useState([]);
    const [subscriptionCounts, setSubscriptionCounts] = useState(0);
    const navigate = useNavigate();
    const { channelId } = useParams();
    const [pageData, setPageData] = useState({});
    const user = useSelector((state) => state.auth.userData);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'Subscribed') {
            fetchSubscribers();
        } else {
            fetchVideos();
        }
    };

    const fetchVideos = async () => {
        if (channelId) {
            const response = await axiosInstance.get(`/users/channel/${channelId}`);
            setVideo(response.data.videos);
            setIsLoading(false);
        } else {
            const response = await axiosInstance.get(`/users/profile`);
            setVideo(response.data.videos);
            setIsLoading(false);
        }
    };

    const fetchSubscribers = async () => {
        if (channelId) {
            try {
                const response = await axiosInstance.get(`/subscriptions/subscribers/${channelId}`);
                setSubscribersData(response.data.data);
                console.log(response.data)
            } catch (error) {
                console.error("Failed to fetch subscribers", error);
            }
        } else {
            try {
                const response = await axiosInstance.get("/subscriptions/channelSubscribers");
                setSubscribersData(response.data.data);
                console.log(response.data.data)
            } catch (err) {
                console.error("Failed to fetch subscribers", err);
            }
        }
    };

    const fetchSubscriptionData = async () => {
        if (channelId) {
            const response = await axiosInstance.get(`/users/c/${channelId}`);
            const { subscribersCount } = response.data.data;
            setPageData(response.data.data);
            console.log(response.data.data)
            setSubscriptionCounts(subscribersCount);
        } else {
            try {
                const response = await axiosInstance.get("/subscriptions/subscriberCount");
                const { subscriptionCount } = response.data.data;
                console.log(response.data.data)
                setSubscriptionCounts(subscriptionCount);
            } catch (error) {
                console.error("Error fetching subscription data:", error);
            }
        }
    };

    useEffect(() => {
        fetchVideos();
        fetchSubscriptionData();
    }, []);
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-opacity-50 bg-black w-screen fixed top-0 left-0 z-50">
                <div className="w-16 h-16 border-8 border-t-8 border-white border-solid rounded-full animate-spin"></div>
            </div>
        );
      } 
    return (
        <div className="h-screen bg-black w-full overflow-y-scroll">
            <Navbar />
            <div className="fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-black flex flex-col gap-3 overflow-y-auto pt-4 border-r border-gray-600">
                <Sidebar />
            </div>

            <div className="pl-64 pt-20 pb-8 px-4 w-[calc(100vw-17px)]">
                {/* Cover Image and Avatar Section */}
                <div className="relative w-full">
                    <img
                        className="w-full h-64 object-cover"
                        src={pageData?.coverImage || user?.coverImage}
                        alt="Cover"
                    />
                    <div className="absolute top-44 left-8">
                        <img
                            className="rounded-full w-32 h-32 border-4 border-gray-900"
                            src={pageData?.avatar || user?.avatar}
                            alt="Avatar"
                        />
                    </div>
                </div>

                {/* User Information */}
                <div className="ml-48 mt-8">
                    <h1 className="text-3xl font-bold text-white">{pageData?.fullName || user?.fullName}</h1>
                    <p className="text-sm text-gray-400">@{pageData?.username || user?.username}</p>
                    <p className="text-gray-400 mt-2">Subscribers: {subscriptionCounts}</p>
                </div>

                {/* Tabs */}
                <div className="mt-8 border-b border-gray-700 flex justify-center mb-2 pb-2">
                    <button
                        className={`py-2 px-4 focus:outline-none hover:border-transparent hover:text-gray-300 bg-transparent ${
                            activeTab === 'Videos' ? 'text-white border border-b-2 border-white' : 'text-white'
                        }`}
                        onClick={() => handleTabChange('Videos')}
                    >
                        Videos
                    </button>
                    <button
                        className={`py-2 px-4 focus:outline-none hover:border-transparent hover:text-gray-300 bg-transparent ${
                            activeTab === 'Subscribed' ? 'text-white border border-b-2 border-white' : 'text-white'
                        }`}
                        onClick={() => handleTabChange('Subscribed')}
                    >
                        Subscribed
                    </button>
                </div>


                {/* Content Based on Active Tab */}
                <div className="p-4">
                    {activeTab === 'Videos' ? (
                        <div>
                        {videos.length === 0 ? (
                            <div className="text-gray-500">No videos available</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {videos.map((video) => (
                                    <ProfileVideoCard key={video._id} video={video} />
                                ))}
                            </div>
                        )}
                    </div>
                    
                    ) : (
                        <div>
                            {subscribersData.length === 0 ? (
                                <div className="text-gray-500">No subscribers yet</div>
                            ) : (
                                subscribersData.map((subscriber) =>
                                    subscriber.subscriberDetails && (
                                        <div
                                            key={subscriber._id}
                                            className="flex items-center py-4 space-x-4 ml-4"
                                        >
                                            <img
                                                src={subscriber.subscriberDetails.avatar}
                                                alt="Subscriber Avatar"
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div className='flex justify-between'>
                                                <div>
                                                <h3 className="text-xl font-semibold text-white">
                                                    {subscriber.subscriberDetails.username}
                                                </h3>
                                                </div> 
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Setting;
