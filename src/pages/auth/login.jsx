import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";

import { useAuth } from '@/contexts/AuthContext';
import { checkRateLimit, recordAttempt, formatRemainingTime } from '@/utils/rateLimiter';
import LoginBanner from '@/assets/images/login-banner-agora.webp';
import logoAgora from '@/assets/icons/logo_agora_communityfeedback.png';


export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember_me: false
    });
    const [rateLimit, setRateLimit] = useState({
        isBlocked: false,
        remainingTime: 0
    });

    // Check for success message from navigation state (e.g., after password reset)
    useEffect(() => {
        if (location.state?.message) {
            setSuccess(location.state.message);
            // Clear the state after showing message
            window.history.replaceState({}, document.title);
        }
    }, [location]);
    
    useEffect(() => {
        document.body.style.cursor = 'default';
        return () => {
            document.body.style.cursor = '';
        };
    }, []);
    useEffect(() => {
        const checkLimit = () => {
            const limit = checkRateLimit();
            setRateLimit(limit);
        };

        checkLimit();

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
        setSuccess('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const limit = checkRateLimit();
        if (limit.isBlocked) {
            setError(`Too many login attempts. Please wait ${formatRemainingTime(limit.remainingTime)} before trying again.`);
            setRateLimit(limit);
            return;
        }

        setLoading(true);

        try {
            recordAttempt();

            const result = await login(formData);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
                
                const newLimit = checkRateLimit();
                setRateLimit(newLimit);
            }
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex items-center w-full max-w-5xl overflow-hidden rounded-2xl">
                {/* Left side */}
                <div className="w-full p-6 sm:p-10 md:w-1/2">
                    {/* Logo */}
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
                        <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 border bo\rder-red-200 rounded-lg">
                            {error}
                        </div>
                    )}                    {success && (
                        <div className="p-3 mb-4 text-sm text-green-600 bg-green-100 border border-green-200 rounded-lg">
                            {success}
                        </div>
                    )}                    {/* Main Content */}
                    <form onSubmit={handleSubmit} className="space-y-2">
                        {/* Input Form */}
                        <div className="space-y-4">                            
                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    required
                                    disabled={rateLimit.isBlocked || loading}
                                />
                            </div>
                            {/* Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        </div>
                        {/* Remember me & Forgot Password */}
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
                            <Link 
                                to="/RESET-send-email" 
                                onClick={() => sessionStorage.setItem('forgot_password_flow', 'true')}
                                className="text-red-400 hover:text-red-500 disabled:cursor-not-allowed" 
                                disabled={rateLimit.isBlocked || loading}
                            >
                                Forgot Password
                            </Link>
                        </div>
                        <div className="space-y-6">
                            {/* Action Button */}
                            <div className="space-y-2">                                
                                <button
                                    type="submit"
                                    className="w-full py-2 mt-4 text-white transition bg-indigo-500 rounded-md cursor-pointer hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                            </div>
                        </div>
                        <Link to="/" className='flex items-center justify-center gap-2'>
                            <IoArrowBack className='w-4 h-4 text-gray-600'/>         
                            <p className='text-xs text-gray-600'>Back to home</p>
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