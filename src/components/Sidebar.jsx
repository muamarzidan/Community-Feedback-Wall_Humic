import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';

import { useCursorMode } from '../contexts/CursorModeContext';
import { useAuth } from '../contexts/AuthContext';
import HomeIcon from '@/assets/icons/home-agora.png';
import ListIcon from '../assets/icons/listnote-agora.png';
import AboutIcon from '../assets/icons/about-agora.png';
import AuthModal from './AuthModal';


const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setCursorMode } = useCursorMode();
    const { user, isAuthenticated, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
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
        ...(isAuthenticated ? [{
            icon: ListIcon,
            label: 'My Notes',
            path: '/my-notes',
            active: location.pathname === '/my-notes'
        }] : []),
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
    const handleGuestClick = () => {
        // Reset cursor to default when opening modal
        setCursorMode('default');
        document.body.style.cursor = 'default';
        setIsAuthModalOpen(true);
    };
    const handleModalClose = () => {
        setIsAuthModalOpen(false);
    };
    
    // Check screen size for mobile menu state
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const DesktopSidebar = () => (
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
                {!isAuthenticated ? (
                    /* If not authenticated */
                    <button
                        onClick={handleGuestClick}
                        className="flex items-center justify-center w-12 h-12 text-white transition-colors bg-gray-400 rounded-full cursor-pointer hover:bg-gray-500"
                        title="Guest Profile - Click to Login"
                    >
                        <span className="text-xs font-bold text-white">G</span>
                    </button>
                ) : (
                    /* If authenticated */
                    <Link
                        to="/profile"
                        className="flex items-center justify-center w-12 h-12 text-white transition-colors rounded-full cursor-pointer bg-primary-500 hover:bg-primary-600"
                        title="User Profile"
                    >
                        <span className="text-xs font-bold text-white">
                            {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                        </span>
                    </Link>
                )}
            </div>
        </div>
    );
    const MobileNavbar = () => (
        <>
            {/* Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-[55] flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
                {/* Logo */}
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-[url('@/assets/icons/logo-agora.png')] bg-contain bg-center bg-no-repeat"></div>
                    <span className="ml-2 text-lg font-bold text-primary-600">Nexora</span>
                </div>
                {/* Hamburger Menu */}
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 text-gray-600 transition-colors rounded-lg cursor-pointer hover:text-primary-600 hover:bg-primary-50"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-[60] bg-black/50"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    {/* Mobile Sidebar */}
                    <div 
                        className="fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out transform bg-white shadow-xl w-72"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-[url('@/assets/icons/logo-agora.png')] bg-contain bg-center bg-no-repeat"></div>
                                <span className="ml-2 text-lg font-bold text-primary-500">Agora</span>
                            </div>
                            {/* Close Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-gray-600 rounded-lg cursor-pointer hover:text-gray-800 hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Menu Items */}
                        <div className="p-4 space-y-2">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-lg transition-colors text-left cursor-pointer ${
                                        item.active
                                            ? 'bg-primary-50 text-primary-500'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <img src={item.icon} alt={item.label} className="w-6 h-6" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                            {/* Divider */}
                            <div className="my-4 border-t border-gray-200"></div>
                            {/* Profile Section */}
                            <div className="space-y-2">
                                {isAuthenticated ? (
                                    <>
                                        <button
                                            onClick={() => navigate('/profile')}
                                            className="flex items-center w-full gap-4 p-4 text-left text-gray-700 transition-colors rounded-lg cursor-pointer hover:bg-gray-100"
                                        >
                                            <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full bg-primary-500">
                                                <span>{user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}</span>
                                            </div>
                                            <span className="font-medium">Profile</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                logout();
                                            }}
                                            className="flex items-center w-full gap-4 p-4 text-left text-red-600 transition-colors rounded-lg cursor-pointer hover:bg-red-100"
                                        >
                                            <LogIn className="w-6 h-6 rotate-180" />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleGuestClick}
                                        className="flex items-center w-full gap-4 p-4 text-left text-gray-700 transition-colors rounded-lg cursor-pointer hover:bg-gray-100"
                                    >
                                        <LogIn className="w-6 h-6" />
                                        <span className="font-medium">Login</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    return (
        <>
        <AuthModal 
            isOpen={isAuthModalOpen} 
            onClose={handleModalClose}
            initialMode="login"
        />
        <div className="sm:hidden">
            <MobileNavbar />
        </div>
        <div className="hidden sm:block">
            <DesktopSidebar />
        </div>
        </>
    );
};

export default Sidebar;