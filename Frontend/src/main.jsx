import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App'
import Home from './pages/Home.jsx'
import SearchResultPage from './pages/SearchResultPage'
import WatchHistory from './pages/WatchHistory'
import MyPlaylist from './pages/MyPlaylist'
import PlaylistVideos from './pages/PlaylistVideos'
import LikedVideos from './pages/LikedVideos'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} />
      <Route path="/Home" element={<Home/>}/>
      <Route path="/search" element={<SearchResultPage/>}/>
      <Route path="/WatchHistory" element={<WatchHistory/>}/>
      <Route path="/MyPlaylist" element={<MyPlaylist/>}/>
      <Route path="/PlaylistVideos" element={<PlaylistVideos/>}/>
      <Route path="/LikedVideos" element={<LikedVideos/>}/>
    </>
  )
);
   

createRoot(document.getElementById('root')).render( 
  <RouterProvider router={router} />
)
