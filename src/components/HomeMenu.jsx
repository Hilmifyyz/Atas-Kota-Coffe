import React from "react";
import { Link } from "react-router-dom";

const HomeMenu = () => {
    return (
        <section className="w-screen min-h-[75vh] border-t-2 border-[#D9D9D9] bg-brownpage">
            <div className="flex flex-row">
                <div className="flex flex-col p-6 w-[350px] min-h-[75vh] border-r-2 border-[#D9D9D9]">
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
                <div className="w-full min-h-full pt-8">
                    <div className="mb-8">
                        <h2 className="font-sans font-[700] text-2xl mb-2">Menu Kami</h2>
                        <p className="font-sans font-[500] text-[#716C6C]">Nikmati berbagai menu kami yang banyak variannya</p>
                    </div>
                    <div className="flex flex-wrap gap-4 px-6">
                        {/* Menu Item - Added fixed width */}
                        {[...Array(8)].map((_, index) => (
                            <Link to="/menu/item">
                            <div key={index} className="w-[230px] bg-white rounded-2xl shadow-2xl relative overflow-hidden">
                                <div className="relative">
                                    <div className="h-[300px] w-full bg-Alfredo bg-cover bg-center" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    
                                    <div className="absolute bottom-0 text-left left-0 p-4 text-white">
                                        <h3 className="font-semibold text-xl">Alfredo Pasta</h3>
                                        <p className="pl-1 text-white">Rp 21.000</p>
                                    </div>

                                    <button className="absolute bottom-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                                        <span className="text-xl pb-1">+</span>
                                    </button>
                                </div>
                            </div>
                            </Link>
                        ))}
                    </div>
                    <Link to="/menu" className="flex justify-center mt-4">
                        <div className="p-4 bg-[#E6D5B7] m-6 min-w-64 rounded-[26px]">
                            <h1 className="font-sans font-[500] text-[20px]">See All</h1>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default HomeMenu;
