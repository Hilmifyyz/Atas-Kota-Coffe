import React from "react";
import { Link } from "react-router-dom";

const AddProduct = () => {
    return (
        <div className="bg-brownpage min-h-screen absolute overflow-hidden overflow-x-hidden top-0 left-0 right-0 flex flex-row">
            {/* Sidebar */}
            <div className="w-1/6 h-screen border-r-2 border-[#D9D9D9]">
                <h1 className="text-center font-sans font-[700] text-[24px] mt-10">Dasboard Admin</h1>
                <div className="grid grid-cols-1 grid-rows-4 gap-4 mt-10">
                    <div className="">
                        <Link to="/admin/product" className="flex flex-col items-center justify-center bg-[#EBEBEB] hover:bg-[#d9d9d9] rounded-xl mx-4 py-2">
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
                        <Link to="/admin/history" className="flex flex-col items-center justify-center  hover:bg-[#d9d9d9] rounded-xl mx-4 py-2">
                            <h1 className="font-sans font-[600] text-xl">Riwayat</h1>
                        </Link>
                    </div>
                </div>
            </div>
            {/* content */}
            <div className="w-full justify-center items-center">
                <h1 className="font-sans font-[700] text-3xl my-6">Products</h1>
                <div className="mx-10">
                    <div className="flex flex-row place-content-between">
                        <h1 className="font-sans font-[600] text-2xl">Add Product</h1>
                        <button type="submit" className="py-2 px-12 bg-white border border-[#9B9999] rounded-lg font-sans font-[700] text-xl text-[#818080]">
                        Save
                        </button>
                    </div>
                    <div className="w-full mt-10 p-10 bg-white rounded-xl border ">
                        <div className="grid grid-cols-4 grid-rows-6 gap-4 *:border-2 *:rounded-xl">
                            <div className="col-span-2 row-span-3 justify-center flex items-center place-items-center">
                                <input type="file" className="file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                            </div>
                            <div className="col-span-2 col-start-1 row-start-4">
                                <input type="text" className="w-full h-full pl-3 py-3 rounded-xl" placeholder="Title" />
                            </div>
                            <div className="col-start-3 row-start-1">
                                <input type="text" className="w-full h-full pl-3 rounded-xl" placeholder="Price" />
                            </div>
                            <div className="col-start-4 row-start-1 min-h-10 items-center justify-center">
                                <input type="text" className="w-full h-full pl-3 rounded-xl" placeholder="Category" />
                            </div>
                                <textarea name="description" id="description" rows="4" cols="50" placeholder="description" className="col-span-2 row-span-2 row-start-5 pl-2 py-2 resize-none"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;