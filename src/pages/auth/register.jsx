import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { HiOutlineEyeOff } from "react-icons/hi";


export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex w-full max-w-5xl rounded-2xl overflow-hidden">
                {/* Left side */}
                <div className="hidden md:block w-1/2 sm:flex items-center justify-center p-8">
                    <img
                        src="/images/register-banner_humic_communityfeedbackwall.png"
                        alt="Signup illustration"
                        className="rounded-2xl w-full max-w-md h-full"
                    />
                </div>

                {/* Right side */}
                <div className="w-full md:w-1/2 p-10">
                    <div className="flex justify-end">
                        <h1 className="text-3xl font-bold">Logo</h1>
                    </div>

                    <h2 className="text-2xl font-semibold mt-8">Sign up</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        Let’s get you all set up so you can access your personal account.
                    </p>

                    <form className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                <HiOutlineEyeOff className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                <HiOutlineEyeOff className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <input type="checkbox" className="accent-indigo-500 mt-1" />
                            <p>
                                I agree to all the{" "}
                                <a href="#" className="text-red-500 font-medium">
                                    Terms
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-red-500 font-medium">
                                    Privacy Policies
                                </a>
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
                        >
                            Create account
                        </button>

                        <p className="text-center text-sm text-gray-600">
                            Already have an account?{" "}
                            <a href="/login" className="text-red-500 font-medium">
                                Login
                            </a>
                        </p>

                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="px-2 text-gray-400 text-sm">Or Sign up with</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <div className="w-full flex justify-center gap-4">
                            <button className="w-full border border-gray-300 rounded-md px-6 py-2 hover:bg-gray-50 flex items-center gap-2">
                                <FaFacebook className="w-full h-5 text-blue-600" />
                            </button>
                            <button className="w-full border border-gray-300 rounded-md px-6 py-2 hover:bg-gray-50 flex items-center gap-2">
                                <FcGoogle className="w-full h-5" />
                            </button>
                            <button className="w-full border border-gray-300 rounded-md px-6 py-2 hover:bg-gray-50 flex items-center gap-2">
                                <FaApple className="w-full h-5" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
