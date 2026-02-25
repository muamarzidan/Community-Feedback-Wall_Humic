import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";

import { passwordResetAPI } from '@/lib/api';
import { checkRateLimit, recordAttempt, formatRemainingTime } from '@/utils/rateLimiter';


export default function VerificationEmailCodePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    
    const [rateLimit, setRateLimit] = useState({
        isBlocked: false,
        remainingTime: 0
    });

    // Get email from sessionStorage
    useEffect(() => {
        const savedEmail = sessionStorage.getItem('reset_email');
        if (!savedEmail) {
            navigate('/RESET-send-email', { replace: true });
        } else {
            setEmail(savedEmail);
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
    
    const handleCodeChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);
        setError('');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        
        if (!/^\d+$/.test(pastedData)) return;
        
        const digits = pastedData.slice(0, 6).split('');
        const newCode = [...verificationCode];
        
        digits.forEach((digit, index) => {
            if (index < 6) {
                newCode[index] = digit;
            }
        });
        
        setVerificationCode(newCode);
        setError('');
        
        const nextEmptyIndex = newCode.findIndex(code => !code);
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const code = verificationCode.join('');
        if (code.length !== 6) {
            setError('Please enter the complete 6-digit verification code.');
            return;
        }

        const limit = checkRateLimit();
        if (limit.isBlocked) {
            setError(`Too many attempts. Please wait ${formatRemainingTime(limit.remainingTime)} before trying again.`);
            setRateLimit(limit);
            return;
        }

        setLoading(true);

        try {
            recordAttempt();

            const response = await passwordResetAPI.verifyResetCode(email, code);
            
            if (response.data) {
                sessionStorage.setItem('reset_token', code);
                navigate('/RESET-new-password');
            }
        } catch (err) {
            console.error('Verification error:', err);
            
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors?.token) {
                setError(err.response.data.errors.token[0]);
            } else {
                setError('Invalid verification code. Please try again.');
            }
            
            const newLimit = checkRateLimit();
            setRateLimit(newLimit);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setError('');
        const limit = checkRateLimit();
        if (limit.isBlocked) {
            setError(`Too many attempts. Please wait ${formatRemainingTime(limit.remainingTime)} before trying again.`);
            return;
        }

        setLoading(true);
        
        try {
            recordAttempt();
            
            const response = await passwordResetAPI.sendResetEmail(email);
            
            if (response.data) {
                // Clear current code
                setVerificationCode(['', '', '', '', '', '']);
                // Focus first input
                inputRefs.current[0]?.focus();
                alert('Verification code resent! Please check your email.');
            }
        } catch (err) {
            console.error('Resend error:', err);
            
            if (err.response?.status === 429) {
                setError('Too many requests. Please wait a minute before trying again.');
            } else {
                setError('Failed to resend code. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-white">
            <div className="w-full space-y-6 max-w-96">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <div className="flex items-center justify-start gap-16">                        
                        <Link 
                            to="/send-email" 
                            className="flex items-center justify-center transition-colors rounded-lg text-primary-500 w-fit hover:bg-gray-100"
                        >
                            <IoArrowBack className='w-6 h-6'/>
                        </Link>
                        <h2 className="text-2xl font-bold text-primary-900">
                            Email Verification
                        </h2>
                    </div>
                    <p className="text-sm text-gray-600">
                        Code sent to <span className="font-medium text-gray-900">{email}</span>
                    </p>
                </div>
                {error && (
                    <div className="p-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                        {error}
                    </div>
                )}
                {/* Form */}
                <form onSubmit={handleSubmit} className="!mt-8 space-y-6">
                    <div className="flex justify-center gap-3">
                        {verificationCode.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className="text-2xl font-semibold text-center transition-all border-2 border-gray-300 w-14 h-14 rounded-xl focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                disabled={rateLimit.isBlocked || loading}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                    {/* Action Button */}
                    <div className="mt-8 space-y-3">                        
                        <button
                            type="submit"
                            className="w-full py-2 text-white transition rounded-lg cursor-pointer bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={loading || rateLimit.isBlocked}
                        >
                            {rateLimit.isBlocked 
                                ? `Wait ${formatRemainingTime(rateLimit.remainingTime)}` 
                                : loading 
                                ? 'Verifying...' 
                                : 'Verify Code'
                            }
                        </button>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                className="text-sm font-medium text-blue-600 transition-colors cursor-pointer hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                                disabled={loading || rateLimit.isBlocked}
                            >
                                Resend Code
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};