import React from "react"

function Navbar() {
    return (
        <nav className="bg-brownpage shadow-md px-6 py-4 w-full rounded-xl">
            <div className="max-w-full mx-auto flex items-center justify-between">
                {/* Left side - Logo */}
                <div className="flex items-center">
                    <div className="h-12 w-32 bg-Logo bg-contain bg-no-repeat bg-center"></div>
                </div>

                {/* Middle - Navigation Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="/about" className="text-gray-700 hover:text-gray-900">About</a>
                    <a href="/menu" className="text-gray-700 hover:text-gray-900">Menu</a>
                    <a href="/categories" className="text-gray-700 hover:text-gray-900">Categories</a>
                </div>

                {/* Right side - Contact, Account, Cart */}
                <div className="flex items-center space-x-6">
                    <a href="/contact" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">Contact Us</a>
                    <button className="text-gray-700 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </button>
                    <button className="text-gray-700 hover:text-gray-900 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">0</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar