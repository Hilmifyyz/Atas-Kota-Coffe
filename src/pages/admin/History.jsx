import React from "react";
import { Link } from "react-router-dom";

const History = () => {
    return (
        <div className="bg-brownpage min-h-screen absolute overflow-hidden overflow-x-hidden top-0 left-0 right-0 flex flex-row">
            {/* Sidebar */}
            <div className="w-[14.4%] h-screen border-r-2 border-[#D9D9D9] fixed">
                <h1 className="text-center font-sans font-[700] text-[24px] mt-10">Dasboard Admin</h1>
                <div className="grid grid-cols-1 grid-rows-4 gap-4 mt-10">
                    <div className="">
                        <Link to="/admin/product" className="flex flex-col items-center justify-center hover:bg-[#d9d9d9] rounded-xl mx-4 py-2">
                            <h1 className="font-sans font-[600] text-xl">Products</h1>
                        </Link>
                    </div>
                    <div className="row-start-2">
                        <Link to="/admin/orders" className="flex flex-col items-center justify-center hover:bg-[#d9d9d9] rounded-xl mx-4 py-2">
                            <h1 className="font-sans font-[600] text-xl">Orders</h1>
                        </Link>
                    </div>
                    <div className="row-start-3">
                        <Link to="/admin/transaction" className="flex flex-col items-center justify-center hover:bg-[#d9d9d9] rounded-xl mx-4 py-2">
                            <h1 className="font-sans font-[600] text-xl">Transaction</h1>
                        </Link>
                    </div>
                    <div className="row-start-4">
                        <Link to="/admin/history" className="flex flex-col items-center justify-center bg-[#EBEBEB] hover:bg-[#d9d9d9] rounded-xl mx-4 py-2">
                            <h1 className="font-sans font-[600] text-xl">Riwayat</h1>
                        </Link>
                    </div>
                </div>
            </div>
            {/* content */}
            <div className="w-full justify-items-end">
                <div className="my-6 mr-10">
                <h1 className="font-sans font-[600] italic text-3xl text-left">Order Receipt History</h1>
                <h1 className="font-sans italic font-[300] text-base text-left mt-1">Latest Order</h1>
                </div>
                {/* Kertas */}
                <div className="mr-10 my-5 p-4 w-[325px] flex flex-col shadow-2xl shadow-[#404040] rounded-lg bg-white">
                    <h1 className="font-sans font-[500] text-3xl text-left">Receipt Order</h1>
                    <h1 className="w-full font-sans font-[300] text-base text-left py-2 border-b-2 border-black">ORD1711202401</h1>
                    <div className="flex flex-row place-content-between pt-2 *:font-sans *:font-[500] *:text-2xl border-b-2 border-black">
                        <h1>Item</h1>
                        <h1>QTY</h1>
                    </div>
                    <div className="flex flex-col py-2 border-b-2 border-black">
                        <div className="flex flex-row items-center place-content-between py-2">
                            <div className="flex flex-col text-left">
                                <h1 className="font-sans font-[600] text-xl">Caffe Latte</h1>
                                <h1 className="font-sans font-[400] text-base">Rp. 21.000</h1>
                            </div>
                            <h1 className="font-sans font-[600] text-lg">1x</h1>
                        </div>
                        <div className="flex flex-row items-center place-content-between py-2">
                            <div className="flex flex-col text-left">
                                <h1 className="font-sans font-[600] text-xl">Alfredo Pasta</h1>
                                <h1 className="font-sans font-[400] text-base">Rp. 21.000</h1>
                            </div>
                            <h1 className="font-sans font-[600] text-lg">1x</h1>
                        </div>
                        <div className="flex flex-row items-center place-content-between py-2">
                            <div className="flex flex-col text-left">
                                <h1 className="font-sans font-[600] text-xl">Roti Bakar</h1>
                                <h1 className="font-sans font-[400] text-base">Rp. 21.000</h1>
                            </div>
                            <h1 className="font-sans font-[600] text-lg">1x</h1>
                        </div>
                    </div>
                    <div className="flex flex-row place-content-between py-4">
                        <h1 className="font-sans italic font-[600] text-xl">Total</h1>
                        <h1 className="font-sans italic font-[400] text-xl">Rp. 63.000</h1>
                    </div>
                    <div className="w-full flex justify-end">
                        <button className="w-36 h-6 rounded-lg bg-[#E5E5E5] hover:bg-slate-300">
                            <h1 className="font-sans italic font-[600] text-sm">Print Receipt</h1>
                        </button>
                    </div>
                </div>
                <div className="mr-10 my-5 p-4 w-[325px] flex flex-col shadow-2xl shadow-[#404040] rounded-lg bg-white">
                    <h1 className="font-sans font-[500] text-3xl text-left">Receipt Order</h1>
                    <h1 className="w-full font-sans font-[300] text-base text-left py-2 border-b-2 border-black">ORD1711202401</h1>
                    <div className="flex flex-row place-content-between pt-2 *:font-sans *:font-[500] *:text-2xl border-b-2 border-black">
                        <h1>Item</h1>
                        <h1>QTY</h1>
                    </div>
                    <div className="flex flex-col py-2 border-b-2 border-black">
                        <div className="flex flex-row items-center place-content-between py-2">
                            <div className="flex flex-col text-left">
                                <h1 className="font-sans font-[600] text-xl">Caffe Latte</h1>
                                <h1 className="font-sans font-[400] text-base">Rp. 21.000</h1>
                            </div>
                            <h1 className="font-sans font-[600] text-lg">1x</h1>
                        </div>
                        <div className="flex flex-row items-center place-content-between py-2">
                            <div className="flex flex-col text-left">
                                <h1 className="font-sans font-[600] text-xl">Alfredo Pasta</h1>
                                <h1 className="font-sans font-[400] text-base">Rp. 21.000</h1>
                            </div>
                            <h1 className="font-sans font-[600] text-lg">1x</h1>
                        </div>
                        <div className="flex flex-row items-center place-content-between py-2">
                            <div className="flex flex-col text-left">
                                <h1 className="font-sans font-[600] text-xl">Roti Bakar</h1>
                                <h1 className="font-sans font-[400] text-base">Rp. 21.000</h1>
                            </div>
                            <h1 className="font-sans font-[600] text-lg">1x</h1>
                        </div>
                    </div>
                    <div className="flex flex-row place-content-between py-4">
                        <h1 className="font-sans italic font-[600] text-xl">Total</h1>
                        <h1 className="font-sans italic font-[400] text-xl">Rp. 63.000</h1>
                    </div>
                    <div className="w-full flex justify-end">
                        <button className="w-36 h-6 rounded-lg bg-[#E5E5E5] hover:bg-slate-300">
                            <h1 className="font-sans italic font-[600] text-sm">Print Receipt</h1>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;