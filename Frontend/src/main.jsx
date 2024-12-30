import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store, {persistor} from './store/store'
import { PersistGate } from 'redux-persist/integration/react' 
import App from './App'
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home.jsx'
import SearchResultPage from './pages/SearchResultPage'
import WatchHistory from './pages/WatchHistory'
import Setting from './pages/Setting'
import PlaylistVideos from './pages/PlaylistVideos'
import LikedVideos from './pages/LikedVideos'
import VideoDetails from './pages/VideoDetails'
import Dashboard from './pages/Dashboard'
import Audience from './pages/Audience'
import MyPlaylists from './pages/MyPlaylists'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<Home/>}/>
      <Route path="/search" element={<SearchResultPage/>}/>
      <Route path="/watchHistory" element={<WatchHistory/>}/>
      <Route path="/settings" element={<Setting/>}/>
      <Route path="/playlists/:playlistId" element={<PlaylistVideos/>}/>
      <Route path="/likedVideos" element={<LikedVideos/>}/>
      <Route path="/video/:videoId" element={<VideoDetails/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/audience" element={<Audience/>}/>
      <Route path="/myplaylist" element={<MyPlaylists/>}/>
    </>
  )
);
   

createRoot(document.getElementById('root')).render(
  <Provider store={store}> 
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            background: '#fff', // Dark theme
            color: '#000',
          },
        }}
      />
    </PersistGate>
  </Provider> 
)