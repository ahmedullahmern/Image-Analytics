import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from "axios";
import { AppRoutes } from "../../constant/constant.jsx";
import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";
import ButtonLoader from '../loader/buttonLoader.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useContext } from 'react';

const LoginFromComp = () => {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const buttonLoader = ButtonLoader()


    const handleLogin = (e) => {
        e.preventDefault();
        const obj = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        if (!obj.email || !obj.password) {
            alert("Please fill in all fields");
            return;
        }

        axios.post(AppRoutes.login, obj)
            .then((res) => {
                setIsLoading(true)
                Cookies.set('token', res?.data?.data?.token)
                setUser(res?.data?.data?.user)
                toast.success("Login Successfully", { pauseOnHover: true })
                navigate("/dashboard")
                setIsLoading(false)
            })
            .catch((err) => {
                setIsLoading(false)
                const errorMessage = err.response ? err.response.data.msg : err.message;
                toast.error(errorMessage)
            });
    };
    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-white">

            <div className="flex flex-col justify-between w-full lg:w-[45%] p-8 lg:p-16">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-lg">X</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">XIS Platform</span>
                </div>

                <div className="max-w-md mx-auto lg:mx-0 w-full py-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500 mb-8">Log in to view your images and analytics.</p>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@email.com"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                        >
                            {isLoading ? buttonLoader : "Login"}
                        </button>
                    </form>
                </div>

                <p className="text-slate-500 text-sm">
                    Create Account ?{' '}
                    <Link to="/signup   " className="text-blue-600 font-bold hover:underline">Register</Link>
                </p>
            </div>

            <div className="hidden lg:flex w-[55%] bg-blue-600 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 px-12 text-center">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl max-w-lg">
                        <h2 className="text-4xl font-bold text-white mb-4">Image Analytics Platform</h2>
                        <p className="text-blue-100 text-lg mb-6">
                            Upload your images, add labels, and view powerful analytics.
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            {[
                                { num: "∞", label: "Images" },
                                { num: "3", label: "Analytics" },
                                { num: "100%", label: "Secure" }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/10 rounded-xl p-3">
                                    <p className="text-2xl font-bold text-white">{item.num}</p>
                                    <p className="text-blue-200 text-sm">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

};

export default LoginFromComp;