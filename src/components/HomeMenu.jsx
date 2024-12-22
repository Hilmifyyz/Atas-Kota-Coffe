import React from "react";
import { Link } from "react-router-dom";

const HomeMenu = () => {
    return (
        <section className="w-screen min-h-screen border-t-2 border-[#D9D9D9] bg-brownpage">
            <div className="flex flex-row gap-4">
                <div className="flex flex-col p-6 w-[350px] min-h-screen border-r-2 border-[#D9D9D9]">
                    <div className="mb-8">
                        <div className="w-full h-14 bg-LogoFooter bg-contain bg-no-repeat bg-center"></div>
                    </div>
                    <div className="space-y-4 mb-8">
                        <h2 className="font-semibold mb-4">Categories</h2>   
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Cari Produk"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <span className="absolute right-3 w-5 h-5 bg-SearchIcon bg-cover top-2.5"></span>
                        </div>
                    </div>
                <details className="cursor-pointer">
                      <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded">
                            <span className="w-5 h-5 mr-2 bg-CoffeeIcon bg-cover bg-center"></span>
                                Coffee
                            </summary>
                            <div className="pl-9 py-2 text-left space-y-2">
                                <Link to="/menu/">
                                <p className="hover:bg-gray-100 p-1">Latte</p>
                                </Link>
                                <Link to="/menu/">
                                <p className="hover:bg-gray-100 p-1">Arabica</p>
                                </Link>
                                <Link to="/menu/">
                                <p className="hover:bg-gray-100 p-1">Espresso</p>
                                </Link>
                            </div>
                        </details>
                </div>
                <div className="w-full h-full bg-blue-500 rounded-lg">
                    
                </div>
            </div>
        </section>
    )
}

export default HomeMenu;
