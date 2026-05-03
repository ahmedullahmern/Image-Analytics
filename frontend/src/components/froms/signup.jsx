import axios from "axios";
import Cookies from 'js-cookie';
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../constant/constant";
import { toast } from 'react-toastify';
import { AuthContext } from "../../context/AuthContext";
import ButtonLoader from "../loader/buttonLoader";

const SignupFormComp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const buttonLoader = ButtonLoader()
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault()
        setIsLoading(true)
        const obj = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value,
        };
        if (!obj.email || !obj.password || !obj.name) {
            setIsLoading(false)
            toast.warning('All fields are required.');
            return;
        }
        axios.post(AppRoutes.signup, obj)
            .then((res) => {
                setIsLoading(true)
                toast.success("Your Account Created Successfully")
                navigate("/login")
            }).catch((err) => {
                setIsLoading(false)
                const errorMessage = err.response ? err?.response?.data?.msg : err.message;
                toast.error(errorMessage)
            })
    }
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
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-500 mb-8">Register for free and get started.</p>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter Your Name"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@email.com"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Min 6 characters"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                        >
                            {isLoading ? buttonLoader : "Register"}
                        </button>
                    </form>
                </div>

                <p className="text-slate-500 text-sm">
                    Pehle se account hai?{' '}
                    <Link to="/login" className="text-blue-600 font-bold hover:underline">Login karo</Link>
                </p>
            </div>

            <div className="hidden lg:flex w-[55%] bg-blue-600 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10 px-12 text-center">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl max-w-lg">
                        <h2 className="text-4xl font-bold text-white mb-4">Shuru Karo Aaj!</h2>
                        <p className="text-blue-100 text-lg">
                            Register and get your personal image analytics dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
    // return (
    //     <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
    //         <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
    //             <h2 className="text-2xl font-bold text-center mb-6">
    //                 SIGN UP
    //             </h2>
    //             <form onSubmit={handleSignup} className="space-y-6">
    //                 {/* Full Name */}
    //                 <div>
    //                     <label htmlFor="name" className="block text-sm font-medium text-gray-700">
    //                         Full Name
    //                     </label>
    //                     <input

    //                         type="text"
    //                         id="name"
    //                         name="name"
    //                         className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
    //                         placeholder="Enter your full name"
    //                     />
    //                 </div>

    //                 {/* Email Address */}
    //                 <div>
    //                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    //                         Email Address
    //                     </label>
    //                     <input

    //                         type="email"
    //                         id="email"
    //                         name="email"
    //                         className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
    //                         placeholder="Enter your email"
    //                     />
    //                 </div>

    //                 {/* Password */}
    //                 <div>
    //                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
    //                         Password
    //                     </label>
    //                     <input

    //                         type="password"
    //                         id="password"
    //                         name="password"
    //                         className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
    //                         placeholder="Enter your password"
    //                     />
    //                 </div>

    //                 {/* Login Redirect */}
    //                 <div className="text-sm text-center text-gray-600">
    //                     Already have an account?{" "}
    //                     <Link to="/login" className="text-blue-600 hover:underline">
    //                         Login
    //                     </Link>
    //                 </div>

    //                 {/* Submit Button */}
    //                 <button
    //                     type="submit"
    //                     disabled={isLoading}
    //                     className="w-full hover:cursor-pointer bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
    //                 >
    //                     {isLoading ? buttonLoader : "Sign Up"}
    //                 </button>
    //             </form>
    //         </div>
    //     </div>
    // );
};

export default SignupFormComp;