import React from "react";
import { Link } from "react-router-dom";

const Transaction = () => {
    return (
        <div className="bg-brownpage min-h-screen absolute overflow-hidden overflow-x-hidden top-0 left-0 right-0 flex flex-row">
            {/* Sidebar */}
            <div className="w-1/6 h-screen border-r-2 border-[#D9D9D9]">
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
                        <Link to="/admin/transaction" className="flex flex-col items-center justify-center bg-[#EBEBEB]  hover:bg-[#d9d9d9] rounded-xl mx-4 py-2">
                            <h1 className="font-sans font-[600] text-xl">Transaction</h1>
                        </Link>
                    </div>
                    <div className="row-start-4">
                        <Link to="/admin/history" className="flex flex-col items-center justify-center  hover:bg-[#d9d9d9] rounded-xl mx-4 py-2">
                            <h1 className="font-sans font-[600] text-xl">Riwayat</h1>
                        </Link>
                    </div>
                </div>
            </div>
            {/* content */}
            <div className="w-full justify-center items-center">
            <h1 className="font-sans font-[700] text-3xl my-6">Transaction</h1>
            </div>
        </div>
    )
}

export default Transaction;