import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";

import { passwordResetAPI } from '@/lib/api';
import { checkRateLimit, recordAttempt, formatRemainingTime } from '@/utils/rateLimiter';


export default function CreateNewPasswordPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [passwordStrength, setPasswordStrength] = useState({
        hasMinLength: false,
        hasUpperLower: false,
        hasNumber: false,
        hasSpecialChar: false
    });
    const [rateLimit, setRateLimit] = useState({
        isBlocked: false,
        remainingTime: 0
    });

    // Get email and token from sessionStorage
    useEffect(() => {
        const savedEmail = sessionStorage.getItem('reset_email');
        const savedToken = sessionStorage.getItem('reset_token');
        
        if (!savedEmail || !savedToken) {
            navigate('/RESET-send-email', { replace: true });
        } else {
            setEmail(savedEmail);
            setToken(savedToken);
        }
    }, [navigate]);
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
    useEffect(() => {
        const password = formData.password;
        
        setPasswordStrength({
            hasMinLength: password.length >= 8,
            hasUpperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[@$!%*#?&]/.test(password)
        });
    }, [formData.password]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError('');
    };
    const isPasswordValid = () => {
        return passwordStrength.hasMinLength && 
                passwordStrength.hasUpperLower && 
                passwordStrength.hasNumber &&
                passwordStrength.hasSpecialChar;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isPasswordValid()) {
            setError('Password tidak memenuhi persyaratan keamanan.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Password dan konfirmasi password tidak cocok.');
            return;
        }

        const limit = checkRateLimit();
        if (limit.isBlocked) {
            setError(`Terlalu banyak percobaan. Silakan tunggu ${formatRemainingTime(limit.remainingTime)} sebelum mencoba lagi.`);
            setRateLimit(limit);
            return;
        }

        setLoading(true);

        try {
            recordAttempt();

            const resetData = {
                email: email,
                token: token,
                password: formData.password,
                password_confirmation: formData.confirmPassword
            };

            const response = await passwordResetAPI.resetPassword(resetData);
            
            if (response.data) {
                sessionStorage.removeItem('reset_email');
                sessionStorage.removeItem('reset_token');
                sessionStorage.removeItem('forgot_password_flow');
                
                navigate('/login', { 
                    state: { 
                        message: 'Password has been reset successfully. Please login with your new password.' 
                    } 
                });
            }
        } catch (err) {
            console.error('Reset password error:', err);
            
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors?.token) {
                setError(err.response.data.errors.token[0]);
            } else if (err.response?.data?.errors?.password) {
                setError(err.response.data.errors.password[0]);
            } else {
                setError('Failed to reset password. Please try again.');
            }
            
            const newLimit = checkRateLimit();
            setRateLimit(newLimit);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-white">
            <div className="w-full space-y-6 max-w-96">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <div className="flex items-center justify-start gap-10">                        
                        <Link 
                            to="/RESET-verification-email-code" 
                            className="flex items-center justify-center transition-colors rounded-lg text-primary-500 w-fit hover:bg-gray-100"
                        >
                            <IoArrowBack className='w-6 h-6'/>
                        </Link>
                        <h2 className="text-2xl font-bold text-primary-900">
                            Create a New Password
                        </h2>
                    </div>
                    <p className="text-sm text-gray-600">
                        Enter your new password below to complete the reset process. Make sure the password you create is strong and secure.
                    </p>
                </div>
                {error && (
                    <div className="p-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                        {error}
                    </div>
                )}
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Password */}
                    <div className="!space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <div className="relative !mt-2">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Add your new password"
                                className="w-full px-4 py-2.5 pr-12 text-sm transition-all border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={rateLimit.isBlocked || loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute text-gray-400 transition-colors -translate-y-1/2 cursor-pointer right-4 top-1/2 hover:text-gray-600 disabled:opacity-50"
                                disabled={rateLimit.isBlocked || loading}
                            >
                                {showPassword ? (
                                    <HiOutlineEye className="w-5 h-5" />
                                ) : (
                                    <HiOutlineEyeOff className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Minimum 8 characters with uppercase, lowercase, number, and special character (@$!%*#?&).
                        </p>
                        {formData.password && (
                            <div className="mt-3 space-y-2">
                                <PasswordRequirement 
                                    met={passwordStrength.hasMinLength}
                                    text="Minimum 8 characters"
                                />
                                <PasswordRequirement 
                                    met={passwordStrength.hasUpperLower}
                                    text="Including uppercase and lowercase letters"
                                />
                                <PasswordRequirement 
                                    met={passwordStrength.hasNumber}
                                    text="Including numbers"
                                />
                                <PasswordRequirement 
                                    met={passwordStrength.hasSpecialChar}
                                    text="Including special characters (@$!%*#?&)"
                                />
                            </div>
                        )}
                    </div>
                    {/* Confirm Password */}
                    <div className="!space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                            Confirm New Password
                        </label>
                        <div className="relative !mt-2">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your new password"
                                className="w-full px-4 py-2.5 pr-12 text-sm transition-all border border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                required
                                disabled={rateLimit.isBlocked || loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute text-gray-400 transition-colors -translate-y-1/2 cursor-pointer right-4 top-1/2 hover:text-gray-600 disabled:opacity-50"
                                disabled={rateLimit.isBlocked || loading}
                            >
                                {showConfirmPassword ? (
                                    <HiOutlineEye className="w-5 h-5" />
                                ) : (
                                    <HiOutlineEyeOff className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {formData.confirmPassword && (
                            <div className="flex items-center gap-2">
                                {formData.password === formData.confirmPassword ? (
                                    <>
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs text-green-600">Password match</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs text-red-600">Password does not match</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Action Button */}
                    <button
                        type="submit"
                        className="w-full py-2 mt-3 text-base font-medium text-white transition-colors rounded-lg cursor-pointer bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={
                            loading || 
                            rateLimit.isBlocked || 
                            !isPasswordValid() || 
                            formData.password !== formData.confirmPassword ||
                            !formData.password ||
                            !formData.confirmPassword
                        }
                    >
                        {rateLimit.isBlocked 
                            ? `Wait ${formatRemainingTime(rateLimit.remainingTime)}` 
                            : loading 
                            ? 'Saving...' 
                            : 'Save New Password'
                        }
                    </button>
                </form>
            </div>
        </div>
    );
};

function PasswordRequirement({ met, text }) {
    return (
        <div className="flex items-center gap-2">
            {met ? (
                <svg className="flex-shrink-0 w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg className="flex-shrink-0 w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            )}
            <span className={`text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
                {text}
            </span>
        </div>
    );
};