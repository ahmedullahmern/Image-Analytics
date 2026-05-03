import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useContext, useState } from 'react'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'

const NavbarComp = () => {
    const { user, setUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const logout = () => {
        Cookies.remove('token')
        setUser(null)
        toast.success("Logout Successfully!")
        navigate('/login')
    }

    return (
        <nav className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex justify-between items-center">

                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-sm">X</span>
                    </div>
                    <span className="font-bold text-blue-600">XIS Platform</span>
                </div>

                <div className="hidden md:flex items-center gap-1">
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

                <div className="hidden md:flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600">Hi, {user?.name}</span>
                    <button
                        onClick={logout}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
                    >
                        Logout
                    </button>
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-2"
                >
                    <span className={`block w-6 h-0.5 bg-slate-600 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-slate-600 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-slate-600 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {menuOpen && (
                <div className="md:hidden mt-4 pb-2 flex flex-col gap-1 border-t border-slate-100 pt-4">
                    <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/images"
                        onClick={() => setMenuOpen(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === '/images' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        My Images
                    </Link>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <span className="text-sm font-medium text-slate-600">Hi, {user?.name}</span>
                        <button
                            onClick={logout}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default NavbarComp