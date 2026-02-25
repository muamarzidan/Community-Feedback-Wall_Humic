import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";

import { passwordResetAPI } from '@/lib/api';
import { checkRateLimit, recordAttempt, formatRemainingTime } from '@/utils/rateLimiter';


export default function SendEmailPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        email: '',
    });
    const [rateLimit, setRateLimit] = useState({
        isBlocked: false,
        remainingTime: 0
    });

    useEffect(() => {
        document.body.style.cursor = 'default';
        
        const hasFlowFromLogin = sessionStorage.getItem('forgot_password_flow');
        if (!hasFlowFromLogin) {
            navigate('/login', { replace: true });
        }
        
        return () => {
            document.body.style.cursor = '';
        };
    }, [navigate]);
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
        setSuccess('');
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const limit = checkRateLimit();
        if (limit.isBlocked) {
            setError(`Too many attempts. Please wait ${formatRemainingTime(limit.remainingTime)} before trying again.`);
            setRateLimit(limit);
            return;
        }

        setLoading(true);

        try {
            recordAttempt();

            const response = await passwordResetAPI.sendResetEmail(formData.email);
            
            if (response.data) {
                setSuccess(response.data.message || 'Verification code sent! Please check your email.');
                
                sessionStorage.setItem('reset_email', formData.email);
                
                setTimeout(() => {
                    navigate('/RESET-verification-email-code');
                }, 2000);
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 429) {
                setError('Too many requests. Please wait a minute before trying again.');
            } else {
                setError('Failed to send verification code. Please try again.');
            }
            
            const newLimit = checkRateLimit();
            setRateLimit(newLimit);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-full space-y-2 text-center md:max-w-96">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <div className="flex items-center justify-center">                        
                        <h2 className="text-2xl font-bold text-primary-900">
                            Forgot Password
                        </h2>
                    </div>
                    <p className="text-sm text-gray-600">
                        Enter your registered email address. We will send you a verification code to reset your password.
                    </p>
                </div>
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-3 text-sm text-green-600 bg-green-100 border border-green-200 rounded-lg">
                        {success}
                    </div>
                )}
                {/* Main Content */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                    <div>
                        <label htmlFor="email" className="mb-2 font-medium text-gray-500">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Add your email address"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                            disabled={rateLimit.isBlocked || loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 mt-2 text-white transition rounded-lg cursor-pointer bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading || rateLimit.isBlocked}
                    >
                        {rateLimit.isBlocked 
                            ? `Wait ${formatRemainingTime(rateLimit.remainingTime)}` 
                            : loading 
                            ? 'Sending...' 
                            : 'Send Verification Code'
                        }
                    </button>
                    <Link to="/login" className='flex items-center justify-center gap-2'>
                        <IoArrowBack className='w-4 h-4 text-gray-600'/>         
                        <p className='text-sm text-gray-600'>Back to Login</p>
                    </Link>  
                </form>
            </div>
        </div>
    );
};