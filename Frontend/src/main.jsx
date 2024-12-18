import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store, {persistor} from './store/store'
import { PersistGate } from 'redux-persist/integration/react' 
import App from './App'
import Home from './pages/Home.jsx'
import SearchResultPage from './pages/SearchResultPage'
import WatchHistory from './pages/WatchHistory'
import MyPlaylist from './pages/MyPlaylist'
import PlaylistVideos from './pages/PlaylistVideos'
import LikedVideos from './pages/LikedVideos'
import VideoDetails from './pages/VideoDetails'

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
      <Route path="/Video" element={<VideoDetails/>}/>
    </>
  )
);
   

createRoot(document.getElementById('root')).render(
  <Provider store={store}> 
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider> 
)