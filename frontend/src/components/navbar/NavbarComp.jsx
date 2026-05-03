import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'

const NavbarComp = () => {
    const { user, setUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const logout = () => {
        Cookies.remove('token')
        setUser(null)
        toast.success("Logout SuccessFully!")
        navigate('/login')
    }

    return (
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-sm">X</span>
                    </div>
                    <span className="font-bold text-blue-600">XIS Platform</span>
                </div>
                <div className="flex gap-1">
                    <Link
                        to="/dashboard"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/images"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/images' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        My Images
                    </Link>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 text-bold">Hi, {user?.name}</span>
                <button
                    onClick={logout}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default NavbarComp