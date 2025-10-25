import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from 'react';
import axios from '../config/axios';
import { UserContext } from "../contex/user.context";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    function submitHandler(e) {
        e.preventDefault();
        axios.post('/users/register', {
            email,
            password
        }).then((res) => {
            console.log(res.log);
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/');
        }).catch((err) => {
            console.log(err.response.data);
        });
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
            {/* Star field background */}
            <div className="absolute inset-0">
                {/* Scattered stars */}
                <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-24 right-32 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-40 left-1/3 w-1 h-1 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-32 right-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-purple-200 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-20 left-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.2s' }}></div>
                <div className="absolute bottom-1/3 left-1/5 w-0.5 h-0.5 bg-blue-100 rounded-full animate-pulse" style={{ animationDelay: '1.8s' }}></div>
                <div className="absolute top-3/4 right-1/5 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
                <div className="absolute top-16 right-1/2 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            </div>

            {/* Animated solar system effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[900px] h-[900px]">
                    {/* Sun at center */}
                    <div className="absolute top-1/2 left-1/2 w-28 h-28 -ml-14 -mt-14 z-10">
                        <div className="absolute inset-0 bg-yellow-400/40 rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute inset-1 bg-gradient-to-br from-yellow-300/70 to-orange-400/70 rounded-full blur-lg"></div>
                        <div className="absolute inset-3 bg-gradient-to-br from-yellow-200 to-orange-500 rounded-full shadow-2xl shadow-yellow-500/60"></div>
                        <div className="absolute inset-5 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full"></div>
                    </div>
                    
                    {/* Orbit 1 - Mercury */}
                    <div className="absolute inset-36 border border-zinc-800/40 rounded-full animate-spin" style={{ animationDuration: '10s', animationTimingFunction: 'linear' }}>
                        <div className="absolute -top-1.5 left-1/2 w-3 h-3 -ml-1.5">
                            <div className="w-3 h-3 bg-gray-500 rounded-full shadow-lg shadow-gray-500/50"></div>
                        </div>
                    </div>
                    
                    {/* Orbit 2 - Venus */}
                    <div className="absolute inset-28 border border-zinc-800/40 rounded-full animate-spin" style={{ animationDuration: '15s', animationTimingFunction: 'linear' }}>
                        <div className="absolute -top-2 left-1/2 w-4 h-4 -ml-2">
                            <div className="w-4 h-4 bg-gradient-to-br from-yellow-200 to-orange-400 rounded-full shadow-lg shadow-orange-400/50"></div>
                        </div>
                    </div>
                    
                    {/* Orbit 3 - Earth with Moon */}
                    <div className="absolute inset-20 border border-zinc-800/50 rounded-full animate-spin" style={{ animationDuration: '20s', animationTimingFunction: 'linear' }}>
                        <div className="absolute -top-2.5 left-1/2 w-5 h-5 -ml-2.5">
                            <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-green-500 rounded-full shadow-lg shadow-blue-400/60"></div>
                            {/* Moon */}
                            <div className="absolute -right-3 top-0 w-1.5 h-1.5 bg-gray-300 rounded-full shadow-sm shadow-gray-300/50"></div>
                        </div>
                    </div>
                    
                    {/* Orbit 4 - Mars */}
                    <div className="absolute inset-12 border border-zinc-800/40 rounded-full animate-spin" style={{ animationDuration: '25s', animationTimingFunction: 'linear' }}>
                        <div className="absolute -top-2 left-1/2 w-4 h-4 -ml-2">
                            <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg shadow-red-500/50"></div>
                        </div>
                    </div>
                    
                    {/* Asteroid Belt */}
                    <div className="absolute inset-4 border border-zinc-700/20 rounded-full border-dashed">
                        <div className="absolute top-0 left-1/4 w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="absolute top-1/4 right-0 w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
                        <div className="absolute bottom-1/4 left-0 w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="absolute bottom-0 right-1/3 w-0.5 h-0.5 bg-gray-500 rounded-full"></div>
                        <div className="absolute top-1/3 left-1/2 w-0.5 h-0.5 bg-gray-600 rounded-full"></div>
                    </div>
                    
                    {/* Orbit 5 - Jupiter */}
                    <div className="absolute -inset-8 border border-zinc-800/40 rounded-full animate-spin" style={{ animationDuration: '35s', animationTimingFunction: 'linear' }}>
                        <div className="absolute -top-5 left-1/2 w-10 h-10 -ml-5">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-300 via-amber-500 to-orange-700 rounded-full shadow-lg shadow-orange-400/50">
                                <div className="absolute top-1/3 left-0 w-full h-0.5 bg-orange-600/40 rounded-full"></div>
                                <div className="absolute top-2/3 left-0 w-full h-0.5 bg-orange-700/40 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Orbit 6 - Saturn with rings */}
                    <div className="absolute -inset-20 border border-zinc-800/40 rounded-full animate-spin" style={{ animationDuration: '45s', animationTimingFunction: 'linear' }}>
                        <div className="absolute -top-4 left-1/2 w-8 h-8 -ml-4">
                            <div className="relative">
                                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-700 rounded-full shadow-lg shadow-yellow-500/50"></div>
                                {/* Saturn's rings */}
                                <div className="absolute top-1/2 left-1/2 w-14 h-3 -ml-7 -mt-1.5 border-2 border-yellow-600/60 rounded-full"></div>
                                <div className="absolute top-1/2 left-1/2 w-12 h-2.5 -ml-6 -mt-1.5 border border-yellow-500/40 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Orbit 7 - Uranus */}
                    <div className="absolute -inset-32 border border-zinc-800/30 rounded-full animate-spin" style={{ animationDuration: '55s', animationTimingFunction: 'linear' }}>
                        <div className="absolute -top-3 left-1/2 w-6 h-6 -ml-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-cyan-300 to-cyan-600 rounded-full shadow-lg shadow-cyan-400/50"></div>
                        </div>
                    </div>
                    
                    {/* Orbit 8 - Neptune */}
                    <div className="absolute -inset-44 border border-zinc-800/30 rounded-full animate-spin" style={{ animationDuration: '65s', animationTimingFunction: 'linear' }}>
                        <div className="absolute -top-3 left-1/2 w-6 h-6 -ml-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-800 rounded-full shadow-lg shadow-blue-600/50"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Shooting stars / Meteorites with proper tails */}
            <div className="absolute top-0 left-1/4 animate-meteor" style={{ animationDelay: '0s' }}>
                <div className="relative w-1 h-1 bg-white rounded-full shadow-lg shadow-white/50">
                    <div className="absolute top-0 right-0 w-32 h-0.5 bg-gradient-to-r from-white via-blue-200 to-transparent" style={{ transform: 'rotate(-45deg) translateX(2px) translateY(-2px)' }}></div>
                </div>
            </div>
            
            <div className="absolute top-0 right-1/3 animate-meteor" style={{ animationDelay: '3s' }}>
                <div className="relative w-1 h-1 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/50">
                    <div className="absolute top-0 right-0 w-40 h-0.5 bg-gradient-to-r from-cyan-300 via-cyan-200 to-transparent" style={{ transform: 'rotate(-50deg) translateX(2px) translateY(-2px)' }}></div>
                </div>
            </div>
            
            <div className="absolute top-0 left-1/2 animate-meteor" style={{ animationDelay: '6s' }}>
                <div className="relative w-1 h-1 bg-purple-300 rounded-full shadow-lg shadow-purple-300/50">
                    <div className="absolute top-0 right-0 w-36 h-0.5 bg-gradient-to-r from-purple-300 via-purple-200 to-transparent" style={{ transform: 'rotate(-40deg) translateX(2px) translateY(-2px)' }}></div>
                </div>
            </div>
            
            <div className="absolute top-0 right-1/4 animate-meteor" style={{ animationDelay: '9s' }}>
                <div className="relative w-1 h-1 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50">
                    <div className="absolute top-0 right-0 w-28 h-0.5 bg-gradient-to-r from-yellow-300 via-yellow-200 to-transparent" style={{ transform: 'rotate(-55deg) translateX(2px) translateY(-2px)' }}></div>
                </div>
            </div>

            {/* Keyframe animation for meteors */}
            <style>{`
                @keyframes meteor {
                    0% {
                        transform: translateY(-50px) translateX(0);
                        opacity: 0;
                    }
                    5% {
                        opacity: 1;
                    }
                    95% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(120vh) translateX(-120vw);
                        opacity: 0;
                    }
                }
                .animate-meteor {
                    animation: meteor 8s linear infinite;
                }
            `}</style>

            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

            {/* Register container */}
            <div className="relative z-10 w-full max-w-sm mx-4">
                <div className="text-center mb-8">
                    {/* Logo/Icon placeholder */}
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-white">
                        <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z" clipRule="evenodd"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-white mb-2">
                        Create your account
                    </h1>
                </div>

                {/* Main card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl p-6">
                    <form className="space-y-4" onSubmit={submitHandler}>
                        {/* Email input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-300">
                                Email address
                            </label>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="w-full px-3 py-2 rounded-md bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-300">
                                Password
                            </label>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="w-full px-3 py-2 rounded-md bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full py-2.5 px-4 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors"
                        >
                            Create Account
                        </button>
                    </form>
                </div>

                {/* Login link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-zinc-500">
                        Already have an account?{" "}
                        <Link 
                            to="/login" 
                            className="text-blue-500 hover:text-blue-400 transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-zinc-800">
                    <div className="flex justify-center gap-6 text-xs text-zinc-600">
                        <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
                        <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-blue-500 transition-colors">Docs</a>
                        <a href="#" className="hover:text-blue-500 transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </div>
    );
}