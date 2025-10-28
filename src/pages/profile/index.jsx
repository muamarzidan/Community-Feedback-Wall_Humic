import { TbLogout2 } from "react-icons/tb";
import { FiEdit3 } from "react-icons/fi";
import { MdLock } from "react-icons/md";

import Layout from "../../components/Layout";

export default function ProfilePage() {
    return (
        <Layout>
            <div className="min-h-screen px-6 py-16 bg-gray-50">
            <div className="mx-auto space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-2xl">
                    <div className="flex flex-col gap-3">
                        <h3 className="text-2xl font-semibold text-black">Profile Photo</h3>
                        <div className="w-24 h-24 bg-gray-200 rounded-full" />
                    </div>
                    <div className="mt-6">
                        <p className="text-xl text-gray-500">Signed in as</p>
                        <h2 className="text-2xl font-semibold text-gray-900">Difa Rindang Utari</h2>
                        <p className="text-xl text-gray-500">difarindang123@gmail.com</p>
                    </div>
                </div>
                {/* Personal Information */}
                <div className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-2xl">
                    <h3 className="text-2xl font-semibold text-black">Personal Information</h3>
                    <div className="flex flex-col gap-2">
                        <div>
                            <label className="text-lg font-medium text-gray-800">Name</label>
                            <div className="flex items-center px-3 py-2 border border-gray-300 rounded-lg">
                                <input
                                    type="text"
                                    value="Difa Rindang Utari"
                                    disabled
                                    className="flex-1 py-1 text-base text-gray-900 bg-transparent outline-none"
                                />
                                <button className="flex items-center justify-center gap-2 text-sm font-medium cursor-pointer text-primary-500">
                                    <FiEdit3 className="w-4 h-4 text-primary-500" />
                                    Edit
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-lg font-medium text-gray-800">Email</label>
                            <div className="flex items-center px-3 py-2 mt-1 border border-gray-300 rounded-lg">
                                <input
                                    type="email"
                                    value="difautariil123@gmail.com"
                                    disabled
                                    className="flex-1 py-1 text-base text-gray-900 bg-transparent outline-none"
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
                <div className="flex flex-col p-6 bg-white border border-gray-200 rounded-2xl sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="mb-3 text-xl font-semibold text-black">Keamanan</h3>
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-medium text-gray-800">Password</p>
                            <p className="text-base text-gray-600">
                                Password terakhir diubah 30 hari yang lalu
                            </p>
                        </div>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 font-medium text-white transition rounded-lg cursor-pointer bg-primary-700 hover:bg-primary-800">
                        <MdLock className="w-5 h-5" />
                        Change Password
                    </button>
                </div>
                <div className="flex justify-end">
                    <button className="flex items-center gap-2 px-5 py-2 font-medium text-white transition bg-red-500 rounded-lg cursor-pointer hover:bg-red-800">
                        <TbLogout2 className="w-5 h-5" />
                        Keluar
                    </button>
                </div>
            </div>
            </div>
        </Layout>
    );
}
