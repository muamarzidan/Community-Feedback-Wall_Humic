import { Link } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { FiEdit3 } from "react-icons/fi";
import { MdLock } from "react-icons/md";
import { RiArrowRightSLine } from "react-icons/ri";
import { TiExport } from "react-icons/ti";

import Layout from "../../components/Layout";

export default function ProfilePage() {
    return (
        <Layout>
            <div className="min-h-screen px-6 py-16 bg-gray-50">
                <div className="mx-auto space-y-6">
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center gap-4 bg-transparent border-0 border-gray-300 sm:p-6 sm:border-1 sm:bg-white sm:flex-row rounded-2xl">
                        <div className="flex flex-col items-center gap-3 sm:min-w-[150px]">
                            <h3 className="text-xl font-semibold text-black sm:text-2xl">Profile Photo</h3>
                            <div className="w-24 h-24 bg-gray-200 rounded-full" />
                        </div>
                        <div className="w-full sm:mt-6">
                            <p className="text-sm text-gray-500 sm:text-xl">Signed in as</p>
                            <h2 className="text-base font-semibold text-gray-900 sm:text-2xl">Difa Rindang Utari</h2>
                            <p className="text-sm text-gray-500 sm:text-xl">difarindang123@gmail.com</p>
                        </div>
                    </div>
                    {/* Personal Information */}
                    <div className="flex flex-col gap-2 bg-transparent border-0 border-gray-300 sm:gap-4 sm:border sm:bg-white sm:p-6 rounded-xl sm:rounded-2xl">
                        <h3 className="text-sm font-semibold text-black sm:text-2xl">Personal Information</h3>
                        <div className="flex flex-col gap-2 p-4 bg-white border border-gray-300 rounded-xl sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
                            <div>
                                <label className="text-sm font-semibold text-black sm:text-lg">Name</label>
                                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-xl sm:rounded-lg">
                                    <input
                                        type="text"
                                        value="Difa Rindang Utari"
                                        disabled
                                        className="flex-1 py-1 text-sm text-black bg-transparent outline-none sm:text-base"
                                    />
                                    <button className="flex items-center justify-center gap-2 text-sm font-medium cursor-pointer text-primary-500">
                                        <FiEdit3 className="w-4 h-4 text-primary-500" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-black sm:text-lg">Email</label>
                                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-xl sm:rounded-lg">
                                    <input
                                        type="email"
                                        value="difautariil123@gmail.com"
                                        disabled
                                        className="flex-1 py-1 text-sm text-black bg-transparent outline-none sm:text-base"
                                    />
                                    <button className="flex items-center justify-center gap-2 text-sm font-medium cursor-pointer text-primary-500">
                                        <FiEdit3 className="w-4 h-4 text-primary-500" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Security */}
                    <div className="flex bg-transparent border-0 border-gray-200 sm:gap-4 sm:p-6 sm:border sm:bg-white rounded-2xl sm:items-center sm:justify-between">
                        <div className="flex flex-col w-full gap-2 sm:gap-4">
                            <h3 className="text-base font-semibold text-black sm:text-xl">Security</h3>
                            <div className="flex items-end justify-between gap-1 p-4 border border-gray-300 rounded-xl sm:p-0 sm:border-0">
                                <div className="flex flex-col">
                                    <p className="text-base font-semibold text-black">Password</p>
                                    <p className="text-base text-gray-600">
                                        Last modified 30 days ago
                                    </p>
                                </div>
                                <button className="flex justify-center px-4 py-2 font-medium text-white transition-colors rounded-lg cursor-pointer h-fit sm:hidden bg-primary-500 hover:bg-primary-700">
                                    Change
                                </button>
                            </div>
                        </div>
                        <button className="items-center justify-center hidden gap-2 px-4 py-2 mt-10 font-medium text-white transition-colors rounded-lg cursor-pointer min-w-50 sm:flex bg-primary-500 hover:bg-primary-700">
                            <MdLock className="w-5 h-5" />
                            Change Password
                        </button>
                    </div>
                    {/* About */}
                    <div className="flex items-end bg-transparent border-0 border-gray-200 sm:gap-4 sm:p-6 sm:border sm:bg-white rounded-2xl sm:justify-between">
                        <div className="flex flex-col w-full gap-2 sm:gap-4">
                            <h3 className="text-base font-semibold text-black sm:text-xl">App</h3>
                            <div className="flex items-center justify-between gap-1 p-4 border border-gray-300 rounded-xl sm:p-0 sm:border-0">
                                <div className="flex flex-col">
                                    <p className="text-base font-semibold text-black">Our Developer</p>
                                    <p className="text-base text-gray-600">
                                        Get to know the app development team
                                    </p>
                                </div>
                                <Link to="/about" className="inline-block cursor-pointer sm:hidden">
                                    <RiArrowRightSLine className="w-5 h-5 text-black" />
                                </Link>
                            </div>
                        </div>
                        <Link to="/about" className="hidden cursor-pointer sm:inline-block">
                            <RiArrowRightSLine className="w-5 h-5 text-black" />
                        </Link>
                    </div>
                    {/* Export data */}
                    <div className="flex flex-col p-0 bg-transparent border-gray-200 sm:p-4 border-non sm:border sm:flex-row sm:justify-between sm:items-start rounded-2xl sm:bg-white">
                        <div className="flex flex-col w-full">
                            <div className="flex items-start justify-between">
                                <h3 className="text-lg font-semibold text-black sm:text-xl">Data Export</h3>
                                <p className="text-sm text-gray-500 sm:text-base">Admin only</p>
                            </div>
                            <div className="flex flex-col gap-3 p-4 mt-3 bg-transparent border border-gray-300 sm:bg-gray-100 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:border-0 rounded-xl">
                                <div className="flex flex-col">
                                    <p className="text-base font-semibold text-black">Export Data</p>
                                    <p className="text-sm text-gray-600 sm:text-base">
                                        Download all feedback data (.csv)
                                    </p>
                                </div>
                                <button className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-colors rounded-lg cursor-pointer bg-gray-950 hover:bg-gray-900 sm:w-auto">
                                    <TiExport className="w-5 h-5" />
                                    Export Data
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Logout */}
                    <Link to="/login" className="flex justify-end">
                        <button className="flex items-center gap-2 px-5 py-2 font-medium text-white transition bg-red-500 rounded-lg cursor-pointer hover:bg-red-800">
                            <TbLogout2 className="w-5 h-5" />
                            Logout
                        </button>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
