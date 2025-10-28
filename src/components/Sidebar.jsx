import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, List, LogIn, Info } from 'lucide-react';

import HomeIcon from '@/assets/icons/home-agora.png';
import ListIcon from '../assets/icons/listnote-agora.png';
import AboutIcon from '../assets/icons/about-agora.png';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const menuItems = [
        {
            icon: HomeIcon,
            label: 'Canvas Home',
            path: '/',
            active: location.pathname === '/'
        },
        {
            icon: ListIcon,
            label: 'Notes List',
            path: '/notes',
            active: location.pathname === '/notes'
        },
        {
            icon: AboutIcon,
            label: 'About',
            path: '/about',
            active: location.pathname === '/about'
        }
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="fixed top-0 left-0 z-40 flex flex-col items-center justify-between w-[100px] h-full py-4 border-gray-200 shadow-xl border-r-1 bg-gray-50">
            {/* Logo & Menu */}
            <div className='space-y-8'>
                {/* Logo */}
                <div className="flex items-center justify-center w-14 h-14 bg-[url('@/assets/icons/logo-agora.png')] bg-contain bg-center bg-no-repeat">
                </div>
                {/* Menu Items */}
                <div className="flex flex-col gap-4">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-14 h-14 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                            item.active
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-primary-600 hover:bg-primary-50'
                            }`}
                            title={item.label}
                        >
                            <img src={item.icon} alt={item.label} className="w-8 h-8" />
                        </button>
                        ))}

                </div>
            </div>
            {/* Profile */}
            <div className="flex flex-col items-center gap-2">
                {/* If not authenticated */}
                <Link
                    to="/profile"
                    className="flex items-center justify-center w-12 h-12 text-white bg-gray-400 rounded-full"
                    title="Guest Profile"
                >
                    <span className="text-xs font-bold text-white">G</span>
                </Link>
                {/* If authenticated */}
                <Link
                    to="/profile"
                    className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-primary-500"
                    title="User Profile"
                >
                    <span className="text-xs font-bold text-white">DR</span>
                </Link>
            </div>
        </div>  
    );
};

export default Sidebar;