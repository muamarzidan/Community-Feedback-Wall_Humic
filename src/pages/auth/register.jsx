import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";

import { useAuth } from '@/contexts/AuthContext';
import { checkRateLimit, recordAttempt, formatRemainingTime } from '@/utils/rateLimiter';
import PasswordStrengthIndicator from '@/components/ui/page/auth/PasswordStrengthIndicator';
import RegisterBanner from '@/assets/images/register-banner-agora.webp';
import logoAgora from '@/assets/icons/logo_agora_communityfeedback.png';


export default function SignUpPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [rateLimit, setRateLimit] = useState({
        isBlocked: false,
        remainingTime: 0
    });
    const [searchParams] = useSearchParams();

    // Restore form data dari sessionStorage saat component mount
    useEffect(() => {
        const savedFormData = sessionStorage.getItem('register_form_data');
        if (savedFormData) {
            try {
                const parsedData = JSON.parse(savedFormData);
                setFormData(parsedData);
                sessionStorage.removeItem('register_form_data');
            } catch (error) {
                console.error('Error parsing saved form data:', error);
            }
        }
    }, []);
    useEffect(() => {
        document.body.style.cursor = 'default';
        return () => {
            document.body.style.cursor = '';
        };
    }, []);
    useEffect(() => {
        if (searchParams.get('termsAccepted') === 'true') {
            setTermsAccepted(true);
        }
    }, [searchParams]);
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
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const limit = checkRateLimit();
        if (limit.isBlocked) {
            setError(`Too many registration attempts. Please wait ${formatRemainingTime(limit.remainingTime)} before trying again.`);
            setRateLimit(limit);
            return;
        }
        if (formData.password !== formData.password_confirmation) {
            setError('Password dan konfirmasi password tidak cocok');
            return;
        }

        setLoading(true);

        try {
            recordAttempt();

            const result = await register(formData);
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
            <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl">
                {/* Left side */}
                <div className="items-center justify-center hidden w-1/2 p-8 lg:flex">
                    <img
                        src={RegisterBanner}
                        alt="Signup illustration"
                        className="w-full h-full max-w-md rounded-2xl"
                    />
                </div>
                {/* Right side */}
                <div className="w-full p-6 sm:p-10 lg:w-1/2">
                    {/* Logo */}
                    <div className="flex lg:justify-end">
                        <Link to="/" className="text-3xl font-bold transition-colors hover:text-gray-700">
                            <img
                                src={logoAgora}
                                alt="Agora Logo"
                                className="w-10"
                            />
                        </Link>
                    </div>
                    <h2 className="mt-8 text-2xl font-semibold">Sign up</h2>
                    <p className="mb-6 text-sm text-gray-500">
                        Let's get you all set up so you can access your personal account.
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
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={rateLimit.isBlocked || loading}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={rateLimit.isBlocked || loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                disabled={rateLimit.isBlocked || loading}
                            >
                                {showPassword ? (
                                    <HiOutlineEye className="w-5 h-5 !cursor-pointer" />
                                ) : (
                                    <HiOutlineEyeOff className="w-5 h-5 !cursor-pointer" />
                                )}
                            </button>
                            <PasswordStrengthIndicator password={formData.password} />
                        </div>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={rateLimit.isBlocked || loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                disabled={rateLimit.isBlocked || loading}
                            >
                                {showConfirmPassword ? (
                                    <HiOutlineEye className="w-5 h-5 !cursor-pointer" />
                                ) : (
                                    <HiOutlineEyeOff className="w-5 h-5 !cursor-pointer" />
                                )}
                            </button>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <input 
                                type="checkbox" 
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                className="mt-1 cursor-pointer accent-primary-500" 
                            />
                            <p>
                                I agree to all the{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        sessionStorage.setItem('register_form_data', JSON.stringify(formData));
                                        navigate('/terms?returnTo=register');
                                    }}
                                    className="font-medium text-red-500 hover:underline"
                                >
                                    Terms
                                </button>{" "}
                                and{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        sessionStorage.setItem('register_form_data', JSON.stringify(formData));
                                        navigate('/privacy?returnTo=register');
                                    }}
                                    className="font-medium text-red-500 hover:underline"
                                >
                                    Privacy Policies
                                </button>
                            </p>
                        </div>
                        <button
                            type="submit"
                            className="!cursor-pointer w-full py-2 text-white transition bg-primary-500 rounded-md hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={loading || rateLimit.isBlocked || !termsAccepted}
                        >
                            {rateLimit.isBlocked 
                                ? `Wait ${formatRemainingTime(rateLimit.remainingTime)}` 
                                : loading 
                                ? 'Creating Account...' 
                                : 'Create Account'
                            }
                        </button>
                        <p className="text-sm text-center text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-red-500 hover:text-red-600 !cursor-pointer">
                                Login
                            </Link>
                        </p>
                        <Link to="/" className='flex items-center justify-center gap-2'>
                            <IoArrowBack className='w-4 h-4 text-gray-600'/>         
                            <p className='text-sm text-gray-600'>Back to home</p>
                        </Link> 
                    </form>
                </div>
            </div>
        </div>
    );
};