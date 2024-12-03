import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App'
import Home from './pages/Home.jsx'
import SearchResult from './pages/SearchResult'
import WatchHistory from './pages/WatchHistory'
import MyPlaylist from './pages/MyPlaylist'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} />
      <Route path="/Home" element={<Home/>}/>
      <Route path="/SearchResult" element={<SearchResult/>}/>
      <Route path="/WatchHistory" element={<WatchHistory/>}/>
      <Route path="/MyPlaylist" element={<MyPlaylist/>}/>
    </>
  )
);
   

createRoot(document.getElementById('root')).render( 
  <RouterProvider router={router} />
)
