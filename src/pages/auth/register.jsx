import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { IoArrowBack } from "react-icons/io5";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";

import { useAuth } from '@/contexts/AuthContext';
import RegisterBanner from '@/assets/images/register-banner-agora.png';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';


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

    // Reset cursor to default on auth pages
    useEffect(() => {
        document.body.style.cursor = 'default';
        return () => {
            document.body.style.cursor = '';
        };
    }, []);

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

        if (formData.password !== formData.password_confirmation) {
            setError('Password dan konfirmasi password tidak cocok');
            return;
        }

        setLoading(true);

        try {
            const result = await register(formData);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message);
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
                <div className="items-center justify-center hidden w-1/2 p-8 md:block sm:flex">
                    <img
                        src={RegisterBanner}
                        alt="Signup illustration"
                        className="w-full h-full max-w-md rounded-2xl"
                    />
                </div>

                {/* Right side */}
                <div className="w-full p-6 sm:p-10 md:w-1/2">
                    <div className="flex sm:justify-end">
                        <Link to="/" className="text-3xl font-bold transition-colors hover:text-gray-700">Logo</Link>
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <HiOutlineEye className="w-5 h-5" />
                                ) : (
                                    <HiOutlineEyeOff className="w-5 h-5" />
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
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? (
                                    <HiOutlineEye className="w-5 h-5 !cursor-pointer" />
                                ) : (   
                                    <HiOutlineEyeOff className="w-5 h-5 !cursor-pointer" />
                                )}
                            </button>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <input type="checkbox" className="mt-1 cursor-pointer accent-primary-500" required />
                            <p>
                                I agree to all the{" "}
                                <a href="#" className="font-medium text-red-500">
                                    Terms
                                </a>{" "}
                                and{" "}
                                <a href="#" className="font-medium text-red-500">
                                    Privacy Policies
                                </a>
                            </p>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 text-white transition-colors rounded-lg cursor-pointer bg-primary-500 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create account'}
                        </button>
                        <p className="text-sm text-center text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-red-500 hover:text-red-600 !cursor-pointer">
                                Login
                            </Link>
                        </p>
                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="px-2 text-sm text-gray-400">Or Sign up with</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>
                        <button type="button" className="flex items-center justify-center w-full gap-2 px-6 py-2 transition-colors border border-gray-300 rounded-lg !cursor-pointer hover:bg-gray-100">
                            <FcGoogle className="w-5 h-5" />
                        </button>
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