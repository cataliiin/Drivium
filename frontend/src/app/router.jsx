import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './AppLayout'
import RequireAuth from './RequireAuth'
import DriveFolderPage from '../pages/DriveFolderPage'
import AuthPage from '../pages/AuthPage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {path:'/login', element: <AuthPage mode="login" />},
  {path:'/register', element: <AuthPage mode="register" />},

  { path:'/',
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {index: true, element: <DriveFolderPage />},
          {path:'folder/:folder_id', element:<DriveFolderPage />}
        ]
      }
      
    ]
  },
    
  {path:'*', element: <NotFoundPage />}
])