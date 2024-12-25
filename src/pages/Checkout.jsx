import React, { useState } from "react";
import { Link } from "react-router-dom";

const Checkout = () => {

    const [openPopup, setOpenPopup] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setOpenPopup(false);
            setIsClosing(false);
        }, 300); // Match this with animation duration
    };

    return (
        <div className="bg-brownpage min-h-screen absolute overflow-hidden overflow-x-hidden top-0 left-0 right-0">
            <div className="pt-32 xl:px-56 lg:px-24 md:px-14 sm:px-20 px-4">
                <h1 className=" text-left mb-8 font-sans font-[700] text-[36px]">Keranjang</h1>
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    {/* Left Section - Cart Items */}
                    <div className="flex-1">
                        {/* Header with Select All */}
                        <div className="flex justify-between items-center bg-white rounded-xl border border-[#b1b1b1] mb-4">
                            <input type="text" className="w-full p-3 rounded-xl bg-white font-sans font-[500]  placeholder:text-[#898989]" placeholder="Username" />
                        </div>
                        <div className="flex justify-between items-center bg-white rounded-xl border border-[#b1b1b1] mb-4">
                            <input type="email" className="w-full p-3 rounded-xl bg-white font-sans font-[500] placeholder:text-[#898989]" placeholder="Email" />
                        </div>
                        <div className="flex justify-between items-center bg-white rounded-xl border border-[#b1b1b1] mb-4">
                            <input type="number" className="w-full p-3 rounded-xl bg-white appearance-none custom-spinner font-sans font-[500] placeholder:text-[#898989]" placeholder="Kontak" />   
                        </div>

                        {/* Cart Item */}
                        <div className="bg-white rounded-lg border border-[#b1b1b1] p-4">
                            <div className="flex items-start gap-4">
                                <div  className="bg-CaffeLatte w-32 h-32 rounded-lg bg-center bg-cover bg-no-repeat"/>
                                <div className="flex-1 text-left">
                                    <h3 className="font-sans font-[700] text-lg">Coffee Latte</h3>
                                    <p className="text-gray-600 font-sans font-[500] ">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis obcaecati error maxime.</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className=" font-sans font-[700] ">Rp. 21.000</span>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Summary */}
                    <div className="w-full md:w-80">
                        <div className="bg-white rounded-lg border border-[#b1b1b1] p-4">
                            <h2 className="font-sans text-left font-[700] text-2xl mb-6">Checkout</h2>
                            <div className="flex justify-between *:font-sans *:font-[700] *:text-lg mb-4">
                                <span>Total</span>
                                <span>Rp. 21.000</span>
                            </div>
                            <div className="flex justify-between items-center my-10">
                                <button onClick={() => setOpenPopup(true)} className="w-full grid grid-cols-4 grid-rows-1 gap-4 bg-[#FFFBF2] border border-[#B1B1B1] text-black py-2 rounded-md hover:bg-[#E6D5B8] font-sans font-[700] text-lg transition-colors">
                                    <div className="pl-2 pr-4 w-full h-8 border-r-2 border-[#D9D9D9]">
                                        <div className="bg-WalletIcon bg-cover bg-no-repeat w-8 h-8"/>
                                    </div>
                                    <div className="col-span-3 w-full">
                                        <h1 className="text-left font-sans font-[600] text-[15px]">Pilih Metode Pembayaran</h1>
                                    </div>
                                </button>
                            </div>
                            <div className="w-full bg-[#E6D5B8] text-black py-2 rounded-lg hover:bg-[#d4b87c] font-sans font-[700] text-lg items-center transition-colors">
                                <Link to="/detail" className="w-full h-full px-28 py-2">Buy</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Popup Payment Method */}
            {
                openPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end">
                        <div className={`bg-[#E6D5B8] p-8 w-4/5 place-items-center rounded-t-3xl *:font-sans *:font-[600] *:text-lg
                            transform transition-transform duration-300 ease-out
                            ${isClosing ? 'animate-slideDown' : 'animate-slideUp'}`}
                        >
                            <h2 className="font-sans font-[700] text-2xl mb-2">Virtual Account</h2>
                            <label for="bca" className="my-2 text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-900 has-[:checked]:bg-indigo-50 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-2xl w-[400px] md:w-[500px] p-4 ring-1 ring-transparent bg-white hover:bg-slate-100">
                            <div className="flex items-center bg-BCAIcon bg-cover bg-no-repeat w-[100px] h-8"/>
                            <div className="*:font-sans *:font-[700]  justify-center">
                                <div className="flex flex-col max-w-[150px] mx-auto">
                                    <h1 className="text-left text-lg">BCA</h1>
                                    <h2 className="text-left text-xs text-black/45 ">Fee $0,18</h2>
                                </div>
                            </div>
                            <input name="payment_method" id="bca" value="bca" type="radio" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" wfd-id="id26"/>
                            </label>

                            <label for="mandiri" className="my-2text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-800 has-[:checked]:bg-indigo-50 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-2xl w-[400px] md:w-[500px] p-4 ring-1 ring-transparent bg-white hover:bg-slate-100">
                            <div className="flex items-center bg-MandiriIcon bg-cover bg-no-repeat w-[110px] h-8"/>
                            <div className="*:font-sans *:font-[700]  justify-center">
                                <div className="flex flex-col max-w-[150px] mx-auto">
                                    <h1 className="text-left text-lg">Bang Mandiri</h1>
                                    <h2 className="text-left text-xs text-black/45 ">Fee $0,20</h2>
                                </div>
                            </div>
                            <input name="payment_method" id="mandiri" value="mandiri" type="radio" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" wfd-id="id27"/>
                            </label>

                            <label for="bni" className="my-2 text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-800 has-[:checked]:bg-indigo-50 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-2xl w-[400px] md:w-[500px] p-4 ring-1 ring-transparent bg-white hover:bg-slate-100">
                            <div className="flex items-center bg-BNIIcon bg-cover w-[120px] h-8"/>
                            <div className="*:font-sans *:font-[700]  justify-center">
                                <div className="flex flex-col max-w-[150px] mx-auto">
                                    <h1 className="text-left text-lg">BNI</h1>
                                    <h2 className="text-left text-xs text-black/45 ">Fee $0,20</h2>
                                </div>
                            </div>
                            <input name="payment_method" id="bni" value="bni" type="radio" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" wfd-id="id28"/>
                            </label>


                            <h2 className="font-sans font-[700] text-2xl mt-4 mb-2">Instan Payment</h2>
                            <label for="dana" className="my-2 text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-900 has-[:checked]:bg-indigo-50 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-2xl w-[400px] md:w-[500px] p-4 ring-1 ring-transparent bg-white hover:bg-slate-100">
                            <div className="flex items-center bg-DanaIcon bg-cover bg-no-repeat w-[110px] h-8"/>
                            <div className="*:font-sans *:font-[700]  justify-center">
                                <div className="flex flex-col max-w-[150px] mx-auto">
                                    <h1 className="text-left text-lg">Dana
                                        <span className="text-xs text-black/60 bg-[#82FF44] rounded-lg ml-[2px] px-4 py-1">Instant</span>
                                    </h1>
                                    <h2 className="text-left text-xs text-black/45 ">Transaction fee 0.3%</h2>
                                </div>
                            </div>
                            <input name="payment_method" id="dana" value="dana" type="radio" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" wfd-id="id26"/>
                            </label>
                            <label for="qris" className="my-2 text-slate-700 has-[:checked]:ring-indigo-200 has-[:checked]:text-indigo-900 has-[:checked]:bg-indigo-50 grid grid-cols-[24px_1fr_auto] items-center gap-6 rounded-2xl w-[400px] md:w-[500px] p-4 ring-1 ring-transparent bg-white hover:bg-slate-100">
                            <div className="flex items-center bg-QRISIcon bg-cover bg-no-repeat w-[100px] h-8"/>
                            <div className="*:font-sans *:font-[700]  justify-center">
                                <div className="flex flex-col max-w-[150px] mx-auto">
                                    <h1 className="text-left text-lg">QRIS
                                        <span className="text-xs text-black/60 bg-[#82FF44] rounded-lg ml-[2px] px-4 py-1">Instant</span>
                                    </h1>
                                    <h2 className="text-left text-xs text-black/45">Transaction fee 0.3%</h2>
                                </div>
                            </div>
                            <input name="payment_method" id="qris" value="qris" type="radio" className="box-content h-1.5 w-1.5 appearance-none rounded-full border-[5px] border-white bg-white bg-clip-padding outline-none ring-1 ring-gray-950/10 checked:border-indigo-500 checked:ring-indigo-500" wfd-id="id26"/>
                            </label>

                            <button onClick={handleClose} className="w-[400px] text-black py-2 mt-4 rounded-lg bg-brownbutton hover:bg-[#d4b87c] font-sans font-[700] text-lg transition-colors">
                                Select
                            </button>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default Checkout;