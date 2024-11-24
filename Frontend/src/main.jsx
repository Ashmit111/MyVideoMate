import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App'

// const router = createBrowserRouter(
//   createRoutesFromElements(

//   )
// )    

createRoot(document.getElementById('root')).render(
  <App />
  // <RouterProvider router={router} />
)
