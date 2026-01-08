import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { IoArrowBack } from "react-icons/io5";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";

import { useAuth } from '@/contexts/AuthContext';
import { checkRateLimit, recordAttempt, formatRemainingTime } from '@/utils/rateLimiter';
import LoginBanner from '@/assets/images/login-banner-agora.webp';
import logoAgora from '@/assets/icons/logo_agora_communityfeedback.png';


export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember_me: false
    });
    const [rateLimit, setRateLimit] = useState({
        isBlocked: false,
        remainingTime: 0
    });

    
    // Reset cursor to default on auth pages
    useEffect(() => {
        document.body.style.cursor = 'default';
        return () => {
            document.body.style.cursor = '';
        };
    }, []);

    // Check rate limit on mount dan setiap detik jika blocked
    useEffect(() => {
        const checkLimit = () => {
            const limit = checkRateLimit();
            setRateLimit(limit);
        };

        checkLimit();

        // Update countdown setiap detik jika blocked
        let interval;
        if (rateLimit.isBlocked && rateLimit.remainingTime > 0) {
            interval = setInterval(checkLimit, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [rateLimit.isBlocked]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        setError('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check rate limit before submit
        const limit = checkRateLimit();
        if (limit.isBlocked) {
            setError(`Too many login attempts. Please wait ${formatRemainingTime(limit.remainingTime)} before trying again.`);
            setRateLimit(limit);
            return;
        }

        setLoading(true);

        try {
            // Record attempt
            recordAttempt();

            const result = await login(formData);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
                
                // Check if rate limited after this attempt
                const newLimit = checkRateLimit();
                setRateLimit(newLimit);
            };
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        };
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl">
                {/* Left side */}
                <div className="w-full p-6 sm:p-10 md:w-1/2">
                    <Link to="/" className="inline-block mb-2 text-3xl font-bold transition-colors hover:text-gray-700">
                        <img
                            src={logoAgora}
                            alt="Agora Logo"
                            className="w-10"
                        />
                    </Link>
                    <h2 className="mt-4 text-2xl font-semibold">Login</h2>
                    <p className="mb-6 text-sm text-gray-500">
                        Login to access your travelwise account
                    </p>
                    {error && (
                        <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}
                    {/* Main Content */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={rateLimit.isBlocked || loading}
                            />
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={rateLimit.isBlocked || loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`${rateLimit.isBlocked || loading ? 'opacity-50 !cursor-not-allowed' : ''} absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 disabled:opacity-50`}
                                disabled={rateLimit.isBlocked || loading}
                            >
                                {showPassword ? (
                                    <HiOutlineEye className="w-5 h-5 !cursor-pointer" />
                                ) : (
                                    <HiOutlineEyeOff className="w-5 h-5 !cursor-pointer" />
                                )}
                            </button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-600">
                                <input 
                                    type="checkbox" 
                                    name="remember_me"
                                    checked={formData.remember_me}
                                    onChange={handleChange}
                                    className="accent-indigo-500 disabled:cursor-not-allowed" 
                                    disabled={rateLimit.isBlocked || loading}
                                />
                                Remember me
                            </label>
                            <a href="#" className="text-red-400 hover:text-red-500">
                                Forgot Password
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 text-white transition bg-indigo-500 rounded-md cursor-pointer hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={loading || rateLimit.isBlocked}
                        >
                            {rateLimit.isBlocked 
                                ? `Wait ${formatRemainingTime(rateLimit.remainingTime)}` 
                                : loading 
                                ? 'Loading...' 
                                : 'Login'
                            }
                        </button>
                        <p className="text-sm text-center text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-medium text-red-500 hover:text-red-600 !cursor-pointer">
                                Sign up
                            </Link>
                        </p>
                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="px-2 text-sm text-gray-400">Or login with</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>
                        <button type="button" className="flex items-center justify-center w-full gap-2 px-6 py-2 border border-gray-300 rounded-lg !cursor-pointer hover:bg-gray-50">
                            <FcGoogle className="w-5 h-5" />
                        </button>
                        <Link to="/" className='flex items-center justify-center gap-2'>
                            <IoArrowBack className='w-4 h-4 text-gray-600'/>         
                            <p className='text-sm text-gray-600'>Back to home</p>
                        </Link>  
                    </form>
                </div>
                {/* Right side */}
                <div className="items-center justify-center hidden w-1/2 p-8 md:flex">
                    <img
                        src={LoginBanner}
                        alt="Login illustration"
                        className="w-full max-w-md rounded-2xl"
                    />
                </div>
            </div>
        </div>
    );
};