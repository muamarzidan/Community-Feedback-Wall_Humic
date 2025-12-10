import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import { TbLogout2 } from "react-icons/tb";
import { TiExport } from "react-icons/ti";
import { FiEdit3 } from "react-icons/fi";
import { MdLock } from "react-icons/md";
import toast from "react-hot-toast";

import { userAPI, authAPI, adminApi } from "../../lib/api";
import Layout from "../../components/Layout";
import UpdatePasswordModal from "../../components/UpdatePasswordModal";
import photoProfile from "@/assets/images/photoprofile.webp";


export default function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });


    useEffect(() => {
        setIsDataLoading(true);
        const fetchUserData = async () => {
            try {
                const response = await userAPI.getUser();
                setUserData(response.data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsDataLoading(false);
            };
        };
        fetchUserData();
    }, []);
    
    const handleEditClick = (field, currentValue) => {
        setEditingField(field);
        setEditValue(currentValue);
        setUpdateMessage({ type: '', text: '' });
    };
    const handleCancelEdit = () => {
        setEditingField(null);
        setEditValue('');
        setUpdateMessage({ type: '', text: '' });
    };
    const handleSaveEdit = async (field) => {
        if (!editValue.trim()) {
            setUpdateMessage({ type: 'error', text: 'Field cannot be empty' });
            return;
        }

        setUpdateLoading(true);
        setUpdateMessage({ type: '', text: '' });

        try {
            const updatedData = { [field]: editValue };
            await userAPI.updateProfile(updatedData);
            
            setUserData((prevData) => ({
                ...prevData,
                ...updatedData,
            }));
            
            setUpdateMessage({ type: 'success', text: 'Profile updated successfully' });
            setEditingField(null);
            setEditValue('');
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setUpdateMessage({ type: '', text: '' });
            }, 3000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to update profile';
            setUpdateMessage({ type: 'error', text: errorMsg });
            console.error("Failed to update personal information:", error);
        } finally {
            setUpdateLoading(false);
        }
    };
    const handleLogout = async () => {
        try {
            setIsDataLoading(true);
            const response = await authAPI?.logout();
            if (response.status === 200) {
                localStorage.removeItem('token_community-feedback');
                localStorage.removeItem('user-data_community-feedback');
                window.location.href = '/login';
                toast.success("Logged out successfully");
            };
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Logout failed. Please try again.");
        } finally {
            setIsDataLoading(false);
        };
    };
    const handleExportData = async () => {
        try {
            const response = await adminApi.getDataExcel();
            
            // Get CSV data from response
            const csvData = response.data;
            
            // Create blob from CSV data
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            
            // Create download link
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            // Set filename with current date
            const date = new Date().toISOString().split('T')[0];
            link.setAttribute('href', url);
            link.setAttribute('download', `notes-export-${date}.csv`);
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            console.log("Data exported successfully");
        } catch (error) {
            console.error("Data export failed:", error);
            alert("Data export failed. Please try again.");
        }
    };

    
    return (
        <Layout>
            <div className="min-h-screen px-6 py-16 bg-gray-50">
                <div className="mx-auto space-y-6">
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center gap-4 bg-transparent border-0 border-gray-300 sm:p-6 sm:border-1 sm:bg-white sm:flex-row rounded-2xl">
                        <div className="flex flex-col items-center gap-3 sm:min-w-[150px]">
                            <h3 className="text-xl font-semibold text-black sm:text-2xl">Profile Photo</h3>
                            <img 
                                src={photoProfile}
                                alt="Profile Photo - Agora"
                                className="object-cover w-16 h-16 rounded-full sm:w-24 sm:h-24"
                            />
                        </div>
                        <div className="w-full sm:mt-6">
                            <p className="text-sm text-gray-500 sm:text-xl">Signed in as</p>
                            <h2 className="text-base font-semibold text-gray-900 sm:text-2xl">{userData?.name || 'Loading...'}</h2>
                            <p className="text-sm text-gray-500 sm:text-xl">{userData?.email || 'Loading...'}</p>
                        </div>
                    </div>
                    {/* Personal Information */}
                    <div className="flex flex-col gap-2 bg-transparent border-0 border-gray-300 sm:gap-4 sm:border sm:bg-white sm:p-6 rounded-xl sm:rounded-2xl">
                        <h3 className="text-sm font-semibold text-black sm:text-2xl">Personal Information</h3>
                        {/* Update Message */}
                        {updateMessage.text && (
                            <div className={`p-3 rounded-lg text-sm ${
                                updateMessage.type === 'success' 
                                    ? 'bg-green-100 text-green-700 border border-green-200' 
                                    : 'bg-red-100 text-red-700 border border-red-200'
                            }`}>
                                {updateMessage.text}
                            </div>
                        )}
                        <div className="flex flex-col gap-2 p-4 bg-white border border-gray-300 rounded-xl sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
                            <div>
                                <label className="text-sm font-semibold text-black sm:text-lg">Name</label>
                                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-xl sm:rounded-lg">
                                    <input
                                        type="text"
                                        value={editingField === 'name' ? editValue : (userData?.name || '')}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        disabled={editingField !== 'name' || updateLoading}
                                        className="flex-1 py-1 text-sm text-black bg-transparent outline-none sm:text-base disabled:opacity-70"
                                    />
                                    {editingField === 'name' ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handleCancelEdit}
                                                disabled={updateLoading}
                                                className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700 disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={() => handleSaveEdit('name')}
                                                disabled={updateLoading}
                                                className="text-sm font-medium cursor-pointer text-primary-500 hover:text-primary-700 disabled:opacity-50"
                                            >
                                                {updateLoading ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleEditClick('name', userData?.name || '')}
                                            className="flex items-center justify-center gap-2 text-sm font-medium cursor-pointer text-primary-500 hover:text-primary-700"
                                        >
                                            <FiEdit3 className="w-4 h-4 text-primary-500" />
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-black sm:text-lg">Email</label>
                                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-xl sm:rounded-lg">
                                    <input
                                        type="email"
                                        value={editingField === 'email' ? editValue : (userData?.email || '')}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        disabled={editingField !== 'email' || updateLoading}
                                        className="flex-1 py-1 text-sm text-black bg-transparent outline-none sm:text-base disabled:opacity-70"
                                    />
                                    {editingField === 'email' ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handleCancelEdit}
                                                disabled={updateLoading}
                                                className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700 disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={() => handleSaveEdit('email')}
                                                disabled={updateLoading}
                                                className="text-sm font-medium cursor-pointer text-primary-500 hover:text-primary-700 disabled:opacity-50"
                                            >
                                                {updateLoading ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => handleEditClick('email', userData?.email || '')}
                                            className="flex items-center justify-center gap-2 text-sm font-medium cursor-pointer text-primary-500 hover:text-primary-700"
                                        >
                                            <FiEdit3 className="w-4 h-4 text-primary-500" />
                                            Edit
                                        </button>
                                    )}
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
                                        {
                                            userData?.updated_at
                                                ? `Last modified ${new Date(userData.updated_at).toLocaleDateString()}`
                                                : 'Never updated'
                                        }
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="flex px-4 py-2 font-medium text-white transition-colors rounded-lg cursor-pointer justify- center h-fit sm:hidden bg-primary-500 hover:bg-primary-700"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="items-center justify-center hidden gap-2 px-4 py-2 mt-10 font-medium text-white transition-colors rounded-lg cursor-pointer min-w-50 sm:flex bg-primary-500 hover:bg-primary-700"
                        >
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
                    {
                        userData?.role === 'admin' && (
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
                                        <button onClick={handleExportData} className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-colors rounded-lg cursor-pointer bg-gray-950 hover:bg-gray-900 sm:w-auto">
                                            <TiExport className="w-5 h-5" />
                                            Export Data
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {/* Button Action */}
                    <div className="flex justify-end" onClick={handleLogout}>
                        <button className="flex items-center gap-2 px-5 py-2 font-medium text-white transition bg-red-500 rounded-lg cursor-pointer hover:bg-red-800">
                            <TbLogout2 className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            {/* Password Modal */}
            <UpdatePasswordModal 
                isOpen={isPasswordModalOpen} 
                onClose={() => setIsPasswordModalOpen(false)} 
            />
        </Layout>
    );
};