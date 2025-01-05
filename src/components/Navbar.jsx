import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';

function Navbar() {
    const { isAdmin } = useAuth();
    const { getCartCount } = useCart();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll behavior
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setShowDropdown(false);
    }, [location]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setShowDropdown(false);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Height of the navbar
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setIsMobileMenuOpen(false);
    };

    const isActive = (path) => {
        if (path.startsWith('#')) {
            return location.hash === path;
        }
        return location.pathname === path;
    };

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
            <nav className={`bg-brownpage shadow-lg px-6 py-4 mx-auto max-w-7xl ${isScrolled ? 'mx-2 rounded-lg' : ''} transition-all duration-300`}>
                <div className="flex items-center justify-between">
                    {/* Left side - Logo */}
                    <div className="flex items-center">
                        <Link to="/" onClick={() => scrollToSection('Top')} className="h-8 w-24 bg-Logo bg-contain bg-no-repeat bg-center transition-transform hover:scale-105">
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                                className="transition-all duration-200"
                            />
                        </svg>
                    </button>

                    {/* Middle - Navigation Links (Desktop) */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button 
                            onClick={() => scrollToSection('Top')}
                            className={`text-gray-700 font-sans font-[500] hover:text-gray-900 transition-colors ${isActive('#Top') ? 'text-gray-900 font-[600]' : ''}`}
                        >
                            Home
                        </button>
                        <Link 
                            to="/menu" 
                            className={`text-gray-700 font-sans font-[500] hover:text-gray-900 transition-colors ${isActive('/menu') ? 'text-gray-900 font-[600]' : ''}`}
                        >
                            Menu
                        </Link>
                        <button 
                            onClick={() => scrollToSection('Location')}
                            className={`text-gray-700 font-sans font-[500] hover:text-gray-900 transition-colors ${isActive('#Location') ? 'text-gray-900 font-[600]' : ''}`}
                        >
                            Location
                        </button>
                        <button 
                            onClick={() => scrollToSection('gallery')}
                            className={`text-gray-700 font-sans font-[500] hover:text-gray-900 transition-colors ${isActive('#gallery') ? 'text-gray-900 font-[600]' : ''}`}
                        >
                            Gallery
                        </button>
                    </div>

                    {/* Right side - Contact, Account, Cart (Desktop) */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button 
                            onClick={() => scrollToSection('footer')}
                            className="bg-brownbutton text-white font-sans font-[500] px-4 py-2 rounded-md hover:bg-brownbuttonhover transition-all duration-300 transform hover:scale-105"
                        >
                            Contact Us
                        </button>
                        <Link 
                            to="/cart" 
                            className={`text-gray-700 hover:text-gray-900 relative transition-transform hover:scale-110 ${isActive('/cart') ? 'text-gray-900' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                        
                        {isAdmin ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="text-gray-700 hover:text-gray-900 flex items-center space-x-2 focus:outline-none"
                                    aria-label="Admin menu"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-sm font-semibold">Admin</span>
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link 
                                            to="/admin/product" 
                                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${isActive('/admin/product') ? 'bg-gray-100 font-semibold' : ''}`}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link 
                                            to="/admin/orders" 
                                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${isActive('/admin/orders') ? 'bg-gray-100 font-semibold' : ''}`}
                                        >
                                            Orders
                                        </Link>
                                        <Link 
                                            to="/admin/history" 
                                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${isActive('/admin/history') ? 'bg-gray-100 font-semibold' : ''}`}
                                        >
                                            History
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className={`text-gray-700 hover:text-gray-900 transition-transform hover:scale-110 ${isActive('/login') ? 'text-gray-900' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                <div 
                    className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                    <div className="flex flex-col space-y-4 pt-4">
                        <button 
                            onClick={() => scrollToSection('Top')}
                            className={`text-gray-700 font-sans font-[500] hover:text-gray-900 transition-colors ${isActive('#Top') ? 'text-gray-900 font-[600]' : ''}`}
                        >
                            Home
                        </button>
                        <Link 
                            to="/menu" 
                            className={`text-gray-700 font-sans font-[500] hover:text-gray-900 transition-colors ${isActive('/menu') ? 'text-gray-900 font-[600]' : ''}`}
                        >
                            Menu
                        </Link>
                        <button 
                            onClick={() => scrollToSection('Location')}
                            className={`text-gray-700 font-sans font-[500] hover:text-gray-900 transition-colors ${isActive('#Location') ? 'text-gray-900 font-[600]' : ''}`}
                        >
                            Location
                        </button>
                        <button 
                            onClick={() => scrollToSection('gallery')}
                            className={`text-gray-700 font-sans font-[500] hover:text-gray-900 transition-colors ${isActive('#gallery') ? 'text-gray-900 font-[600]' : ''}`}
                        >
                            Gallery
                        </button>
                        <button 
                            onClick={() => scrollToSection('footer')}
                            className="bg-brownbutton text-white font-sans font-[500] px-4 py-2 rounded-md hover:bg-brownbuttonhover transition-all duration-300"
                        >
                            Contact Us
                        </button>
                        <Link 
                            to="/cart" 
                            className={`text-gray-700 hover:text-gray-900 flex items-center justify-center transition-colors ${isActive('/cart') ? 'text-gray-900 font-[600]' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="ml-2">Cart</span>
                        </Link>
                        {isAdmin ? (
                            <div className="flex flex-col space-y-2">
                                <Link 
                                    to="/admin/product" 
                                    className={`text-gray-700 hover:text-gray-900 transition-colors ${isActive('/admin/product') ? 'text-gray-900 font-[600]' : ''}`}
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    to="/admin/orders" 
                                    className={`text-gray-700 hover:text-gray-900 transition-colors ${isActive('/admin/orders') ? 'text-gray-900 font-[600]' : ''}`}
                                >
                                    Orders
                                </Link>
                                <Link 
                                    to="/admin/history" 
                                    className={`text-gray-700 hover:text-gray-900 transition-colors ${isActive('/admin/history') ? 'text-gray-900 font-[600]' : ''}`}
                                >
                                    History
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-600 hover:text-red-700 text-left transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className={`text-gray-700 hover:text-gray-900 flex items-center justify-center transition-colors ${isActive('/login') ? 'text-gray-900 font-[600]' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="ml-2">Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;