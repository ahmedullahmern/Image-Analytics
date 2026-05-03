
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Loginpage from './pages/from/loginPage'
import SignUpPage from './pages/from/signuppage'
import DashboardPage from './pages/dashboardPage/dashboardPage'
import ImageUploadPage from './pages/dashboardPage/imageUploadPage'
import ProtectedRoute from './components/ProtectedRoute'


function App() {

  return (
    <>
      <Routes element={<ProtectedRoute />}>
        <Route path='/login' element={<Loginpage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/' element={<Navigate to="/login" />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/images' element={<ImageUploadPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
