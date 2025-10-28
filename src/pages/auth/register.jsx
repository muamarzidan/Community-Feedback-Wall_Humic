import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import RegisterBanner from '@/assets/images/register-banner-agora.png';


export default function SignUpPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Reset cursor to default on auth pages
    useEffect(() => {
        document.body.style.cursor = 'default';
        return () => {
            document.body.style.cursor = '';
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Handle authentication logic here
        console.log('Register form submitted');
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="email"
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
                                required
                            />
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
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
                        </div>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
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
                                    <HiOutlineEye className="w-5 h-5" />
                                ) : (
                                    <HiOutlineEyeOff className="w-5 h-5" />
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
                            className="w-full py-2 text-white transition-colors rounded-lg cursor-pointer bg-primary-500 hover:bg-primary-700"
                        >
                            Create account
                        </button>

                        <p className="text-sm text-center text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="font-medium text-red-500 hover:text-red-600">
                                Login
                            </Link>
                        </p>

                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="px-2 text-sm text-gray-400">Or Sign up with</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <button type="button" className="flex items-center justify-center w-full gap-2 px-6 py-2 transition-colors border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                            <FcGoogle className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
