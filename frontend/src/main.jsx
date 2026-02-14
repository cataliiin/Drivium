import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {path:'/login', element:<h1>Login</h1>},
  {path:'/register', element:<h1>Register</h1>},

  { path:'/',
    element: <App />, //
    children: [
      {index: true, element: <h1>My Drive</h1>},
      {path:'shared-with-me', element:<h1>Shared with me</h1>},
      {path:'folder/:folder_id', element:<h1>Folder</h1>}
    ]
  },
    
  {path:'*', element: <h1>404 Not Found</h1>}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
