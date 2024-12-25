import React from "react";
import LogoPutih from "../assets/Photos/LogoPutih.png";

const Detail = () => {
    return (
        <section className="bg-white w-screen min-h-screen absolute top-0 left-0 pt-24 -z-20">
            <div className="fixed top-0 left-0 w-full h-1/4 bg-[#D38200] -z-10">

            </div>
            <div className="container mx-auto p-4 max-w-3xl">
            {/* Logo Section */}
            <div className="text-center flex flex-row items-center mb-4">
                <h1 className="text-2xl font-sans font-[700]  flex flex-col text-left text-white">Your Orders
                    <span className="text-white text-sm font-sans font-[300]">Selamat datang di atas 
                    <br/>
                    kota selamat menikmati Coffe dan beberapa menu kami</span>
                </h1>
                <img 
                   src={LogoPutih} 
                   alt="Atas Kota Coffee & Space" 
                   className="ml-auto h-16"
               />
                {/* <div className="w-20 h-20 bg-LogoPutih object-cover rounded-full items-end"/> */}
                
            </div>

            {/* User Details Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Detail Pengguna</h2>
                    <span className="text-gray-600 font-sans font-semibold">ID: 28764</span>
                </div>
                <div className="flex flex-row text-left gap-4">
                    <div>
                        <p className="font-sans font-semibold text-gray-600">Username:</p>
                        <p className="font-sans font-semibold text-gray-600">Kontak:</p>
                    </div>
                    <div>
                        <p className="font-sans font-semibold">Daffa Kumara</p>
                        <p className="font-sans font-semibold">081769213487</p>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <h2 className="font-sans text-2xl font-bold mb-4 text-left">Products</h2>
                <div className="space-y-4">
                    {/* Product Item */}
                    <div className="flex items-center justify-between pb-4 border-b border-[#D9D9D9]">
                        <div className="flex items-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-md bg-CaffeLatte bg-cover bg-center"></div>
                            <div className="ml-4 text-left">
                                <h3 className="font-sans text-[16px] font-semibold">Coffee Latte</h3>
                                <p className="text-gray-600 font-sans text-[15px] font-semibold">Rp. 21.000</p>
                            </div>
                        </div>
                        <span className="text-gray-400 font-sans font-semibold">x 1</span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-[#D9D9D9]">
                        <div className="flex items-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-md bg-Alfredo bg-cover bg-center"></div>
                            <div className="ml-4 text-left">
                                <h3 className="font-sans text-[16px] font-semibold">Pasta Alfredo</h3>
                                <p className="text-gray-600 font-sans text-[15px] font-semibold">Rp. 21.000</p>
                            </div>
                        </div>
                        <span className="text-gray-400 font-sans font-semibold">x 2</span>
                    </div>
                </div>
            </div>

            {/* Payment Details Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Detail Pembayaran</h2>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600">ID:</span>
                        <span>12345678</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span>December 25, 2024 at 21:40</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span>Cash</span>
                    </div>
                    <div className="border-t pt-2 mt-4">
                        <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>Rp. 63.000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </section>
    );
};

export default Detail;

