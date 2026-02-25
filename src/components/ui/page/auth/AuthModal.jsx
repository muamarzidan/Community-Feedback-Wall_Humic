import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import { checkRateLimit, recordAttempt, formatRemainingTime } from '@/utils/rateLimiter';


import { useAuth } from '@/contexts/AuthContext';
import PasswordStrengthIndicator from '@/components/ui/page/auth/PasswordStrengthIndicator';
import LoginBanner from '@/assets/images/login-banner-agora.webp';
import RegisterBanner from '@/assets/images/register-banner-agora.webp';


export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState(initialMode);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        remember_me: false
    });
    const [rateLimit, setRateLimit] = useState({
        isBlocked: false,
        remainingTime: 0
    });

    // Sync mode dengan initialMode saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
        }
    }, [isOpen, initialMode]);

    // Restore form data saat modal dibuka dengan mode register
    useEffect(() => {
        if (isOpen && initialMode === 'register') {
            // Restore form data
            const savedFormData = sessionStorage.getItem('authmodal_form_data');
            if (savedFormData) {
                try {
                    const parsedData = JSON.parse(savedFormData);
                    setFormData(parsedData);
                    sessionStorage.removeItem('authmodal_form_data');
                } catch (error) {
                    console.error('Error parsing saved form data:', error);
                }
            }
            
            // Restore termsAccepted status
            const savedTermsAccepted = sessionStorage.getItem('authmodal_terms_accepted');
            if (savedTermsAccepted === 'true') {
                setTermsAccepted(true);
                sessionStorage.removeItem('authmodal_terms_accepted');
            }
        }
    }, [isOpen, initialMode]);

    // Check rate limit on mount
    useEffect(() => {
        if (!isOpen) return;

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
    }, [isOpen, rateLimit.isBlocked]);
    
    // Listen for terms acceptance from Terms/Privacy pages
    useEffect(() => {
        const handleTermsAccepted = (event) => {
            if (event.detail?.accepted) {
                setTermsAccepted(true);
            }
        };
        
        window.addEventListener('termsAccepted', handleTermsAccepted);
        return () => window.removeEventListener('termsAccepted', handleTermsAccepted);
    }, []);
    
    if (!isOpen) return null;

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

        const limit = checkRateLimit();
        if (limit.isBlocked) {
            setError(`Too many ${mode === 'login' ? 'login' : 'registration'} attempts. Please wait ${formatRemainingTime(limit.remainingTime)} before trying again.`);
            setRateLimit(limit);
            return;
        }

        setLoading(true);

        try {
            recordAttempt();

            if (mode === 'login') {
                const result = await login({
                    email: formData.email,
                    password: formData.password,
                    remember_me: formData.remember_me
                });

                if (result.success) {
                    onClose();
                    window.location.reload();
                } else {
                    setError(result.message);
                    
                    const newLimit = checkRateLimit();
                    setRateLimit(newLimit);
                };
            } else {
                if (formData.password !== formData.password_confirmation) {
                    setError('Password dan konfirmasi password tidak cocok');
                    setLoading(false);
                    return;
                };

                const result = await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation
                });

                if (result.success) {
                    onClose();
                } else {
                    setError(result.message);
                    
                    const newLimit = checkRateLimit();
                    setRateLimit(newLimit);
                };
            };
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        };
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setError('');
        setTermsAccepted(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: '',
            remember_me: false
        });
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div 
                className="relative w-full max-w-md p-8 mx-4 bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute text-gray-400 transition-colors cursor-pointer top-4 right-4 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>
                {mode === 'login' ? (
                    <div className='space-y-4'>
                        <h2 className="text-2xl font-semibold text-center">Login</h2>
                        <img src={LoginBanner} alt="Description" className="object-cover aspect-video rounded-2xl" />
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-lg">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-2">
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
                                    className="absolute text-gray-400 transition-colors right-3 top-2.5 hover:text-gray-600 disabled:opacity-50"
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
                                        className="accent-indigo-500" 
                                    />
                                    Remember me
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        sessionStorage.setItem('forgot_password_flow', 'true');
                                        onClose();
                                        navigate('/RESET-send-email');
                                    }}
                                    className="text-red-400 hover:text-red-500 !cursor-pointer"
                                >
                                    Forgot Password
                                </button>
                            </div>
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
                                <button
                                    type="button"
                                    onClick={() => switchMode('register')}
                                    className="font-medium text-red-500 hover:text-red-600 !cursor-pointer"
                                >
                                    Sign up
                                </button>
                            </p>
                        </form>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        <h2 className="pb-2 text-2xl font-semibold text-center">Sign up</h2>
                        <img src={RegisterBanner} alt="RegisterBanner" className="object-cover aspect-video rounded-2xl" />
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-lg">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                    className="absolute text-gray-400 transition-colors right-3 top-2.5 hover:text-gray-600 disabled:opacity-50"
                                    disabled={rateLimit.isBlocked || loading}
                                >
                                    {showPassword ? (
                                        <HiOutlineEye className="w-5 h-5 !cursor-pointer" />
                                    ) : (
                                        <HiOutlineEyeOff className="w-5 h-5 !cursor-pointer" />
                                    )}
                                </button>                                <PasswordStrengthIndicator password={formData.password} />                            </div>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    required
                                    disabled={rateLimit.isBlocked || loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute text-gray-400 transition-colors right-3 top-2.5 hover:text-gray-600 disabled:opacity-50"
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
                                    className="mt-1 cursor-pointer accent-indigo-500" 
                                />
                                <p>
                                    I agree to all the{" "}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            sessionStorage.setItem('authmodal_form_data', JSON.stringify(formData));
                                            onClose();
                                            navigate('/terms?returnTo=modal');
                                        }}
                                        className="font-medium text-red-500 hover:underline"
                                    >
                                        Terms
                                    </button>{" "}
                                    and{" "}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            sessionStorage.setItem('authmodal_form_data', JSON.stringify(formData));
                                            onClose();
                                            navigate('/privacy?returnTo=modal');
                                        }}
                                        className="font-medium text-red-500 hover:underline"
                                    >
                                        Privacy Policies
                                    </button>
                                </p>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 mt-4 text-white transition bg-indigo-500 rounded-md hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={loading || rateLimit.isBlocked || !termsAccepted}
                            >
                                {rateLimit.isBlocked
                                    ? `Wait ${formatRemainingTime(rateLimit.remainingTime)}`
                                    : loading
                                    ? 'Creating...'
                                    : 'Create account'
                                }
                            </button>
                            <p className="text-sm text-center text-gray-600">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode('login')}
                                    className="font-medium text-red-500 !cursor-pointer hover:text-red-600"
                                >
                                    Login
                                </button>
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};