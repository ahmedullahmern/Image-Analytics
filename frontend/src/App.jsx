
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Loginpage from './pages/from/loginPage'
import SignUpPage from './pages/from/signuppage'
import DashboardPage from './pages/dashboardPage/dashboardPage'
import ImageUploadPage from './pages/dashboardPage/imageUploadPage'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'

function App() {
  const { user } = useContext(AuthContext)
  console.log("user in app.jsx-->", user)
  return (
    <>
      <Routes>
        <Route path='/login' element={user ? <Navigate to={"/dashboard"} /> : <Loginpage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/images' element={<ImageUploadPage />} />
      </Routes>
    </>
  )
}

export default App
