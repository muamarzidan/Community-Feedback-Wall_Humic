import { TbLogout2 } from "react-icons/tb";
import { IoMdLock } from "react-icons/io";

import Header from "../../components/Header";

export default function ProfilePage() {
    return (
        <div className="min-h-screen px-6 pt-30 bg-gray-50">
            <Header />
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-4 p-6 bg-white border shadow-sm rounded-2xl">
                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                    <div>
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <h2 className="font-semibold text-gray-900">Difa Rindang Utari</h2>
                        <p className="text-sm text-gray-500">difarindang123@gmail.com</p>
                    </div>
                </div>
                <div className="p-6 bg-white border shadow-sm rounded-2xl">
                    <h3 className="mb-4 font-semibold text-gray-900">Informasi Pribadi</h3>
                    <div className="mb-4">
                        <label className="text-sm font-medium text-gray-600">Nama</label>
                        <div className="flex items-center px-3 py-2 mt-1 border rounded-lg">
                            <input
                                type="text"
                                value="Difa Rindang Utari"
                                disabled
                                className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                            />
                            <button className="text-sm font-medium text-blue-600 hover:underline">
                                Edit
                            </button>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <div className="flex items-center px-3 py-2 mt-1 border rounded-lg">
                            <input
                                type="email"
                                value="difautariil123@gmail.com"
                                disabled
                                className="flex-1 text-sm text-gray-900 bg-transparent outline-none"
                            />
                            <button className="text-sm font-medium text-blue-600 hover:underline">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col p-6 bg-white border shadow-sm rounded-2xl sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="mb-1 font-semibold text-gray-900">Keamanan</h3>
                        <p className="text-sm text-gray-600">
                            Password terakhir diubah 30 hari yang lalu
                        </p>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 mt-4 font-medium text-white transition bg-indigo-500 rounded-lg sm:mt-0 hover:bg-indigo-600">
                        <IoMdLock className="w-5 h-5" />
                        Ubah Password
                    </button>
                </div>
                <div className="flex justify-end">
                    <button className="flex items-center gap-2 px-5 py-2 font-medium text-white transition bg-red-500 rounded-lg hover:bg-red-600">
                        <TbLogout2 className="w-5 h-5" /    >
                        Keluar
                    </button>
                </div>
            </div>
        </div>
    );
}
