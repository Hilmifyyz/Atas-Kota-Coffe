import React from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, ArrowTrendingUpIcon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Description, Field, Label, Select } from '@headlessui/react'


const Orders = () => {
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
                        <Link to="/admin/orders" className="flex flex-col items-center justify-center bg-[#EBEBEB] hover:bg-[#d9d9d9] rounded-xl mx-4 py-2">
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
                <h1 className="font-sans font-[700] text-3xl my-6">Orders</h1>
                <div className="mx-10">   
                    {/* Top */}
                    <div className="grid grid-cols-6 grid-rows-1 *:h-20 *:border-x bg-white border border-[#d9d9d9] rounded-xl ">
                        <div className="relative flex justify-center rounded-l-lg">
                            <CalendarIcon
                                className="w-10 h-full group pointer-events-none absolute left-0 px-2 fill-white/6"
                                aria-hidden="true"
                            />
                            <Select name="status" className="w-full pl-12 appearance-none rounded-l-lg border-none focus:outline-none block font-sans font-[700] text-lg" aria-label="Date">
                                <option value="active">Today</option>
                                <option value="paused">Yesterday</option>
                                <option value="delayed">2 Days ago</option>
                                <option value="canceled">3 Days ago</option>
                            </Select>
                            
                        </div>
                        <div className="flex flex-col py-2 px-4">
                            <h1 className="text-left font-sans font-[600] text-[#828282] text-lg">Total Order</h1>
                            <h1 className="text-left font-sans font-[700] text-xl pt-1">13</h1>
                        </div>
                        <div className="flex flex-col py-2 px-4">
                            <h1 className="text-left font-sans font-[600] text-[#828282] text-lg">Pending</h1>
                            <h1 className="text-left font-sans font-[700] text-xl pt-1">1</h1>
                        </div>
                        <div className="flex flex-col py-2 px-4">
                            <h1 className="text-left font-sans font-[600] text-[#828282] text-lg">Completed</h1>
                            <h1 className="text-left font-sans font-[700] text-xl pt-1">12</h1>
                        </div>
                        <div className="flex flex-col py-2 px-4">
                            <h1 className="text-left font-sans font-[600] text-[#828282] text-lg">Customer</h1>
                            <h1 className="text-left font-sans font-[700] text-xl pt-1">12</h1>
                        </div>
                        <div className="rounded-r-xl flex flex-col py-2 px-4">
                            <h1 className="text-left font-sans font-[600] text-[#828282] text-lg">Persentase Order</h1>
                            <div className="flex flex-row">
                                <ArrowTrendingUpIcon className="w-6 h-6 pt-1"/>
                                <h1 className="font-sans font-[700] text-base mx-2 text-[#0BE400]">40.47%</h1>
                                <h1 className="font-sans font-[500] text-xs pt-1 text-[#959595]">Bulan Terakhir</h1>
                            </div>
                        </div>
                    </div>
                    {/* Table */}
                    <div className="flex flex-row place-content-between mt-10">
                        <div class="relative m-[2px] mb-3 mr-5 float-left">
                            <label for="inputSearch" class="sr-only">Cari</label>
                            <input id="inputSearch" type="text" placeholder="Cari" class="block w-64 rounded-lg border py-3 pl-10 pr-4 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" />
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform">
                                <MagnifyingGlassIcon className="h-6 w-6 text-neutral-500"/>
                            </span>
                        </div>
                        <div class="relative flex items-center m-[2px] mb-3 float-right w-40 border">
                            <label for="inputFilter" class="sr-only">Filter</label>
                            <Select id="inputFilter" class="appearance-none rounded-lg border dark:border-none w-full h-full pl-10 p-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400">
                            <option value="1" selected>Last week</option>
                            <option value="2">Last month</option>
                            <option value="3">Yesterday</option>
                            <option value="4">Last 7 days</option>
                            <option value="5">Last 30 days</option>
                            </Select>
                            <ChevronDownIcon className="w-10 h-10 px-2 left-0 absolute"/>
                        </div>
                    </div>
                    <div className="">
                        <table className="table-auto w-full shadow-md">
                            <thead>
                                <tr className="*:bg-[#EDECEC] *:py-4 *:border-b *:font-sans *:font-[500] *:text-base">
                                    <th className="min-w-10">id</th>
                                    <th className="text-left">Order</th>
                                    <th className="text-left">Costumer</th>
                                    <th className="text-left">Date</th>
                                    <th className="text-right">Total</th>
                                    <th className="text-left pl-10">Payment Status</th>
                                    <th className="pr-14">Item</th>
                                </tr>
                            </thead>
                            <tbody className="*:bg-white">
                                <tr className="border-b *:py-2 *:font-sans *:font-[400] *:text-base">
                                    <th>1</th>
                                    <th className="flex flex-col">
                                        <div className="flex flex-row items-center py-2">
                                            <div className="bg-CaffeLatte bg-cover w-8 h-8"/>
                                            <h1 className="pl-2 font-sans font-[500] text-base">Coffee Latte</h1>
                                        </div>
                                    </th>
                                    <th className="text-left">Risky Muhammad</th>
                                    <th className="text-left">Des 20, 22:00</th>
                                    <th className="text-right">Rp.22.000</th>
                                    <th className="text-left pl-10">Completed</th>
                                    <th className="pr-14">1</th>
                                </tr>
                                <tr className="border-b *:py-2 *:font-sans *:font-[400] *:text-base">
                                    <th>2</th>
                                    <th className="flex flex-col">
                                        <div className="flex flex-row items-center py-2">
                                            <div className="bg-CaffeLatte bg-cover w-8 h-8"/>
                                            <h1 className="pl-2 font-sans font-[500] text-base">Coffee Latte</h1>
                                        </div>
                                    </th>
                                    <th className="text-left">Risky Muhammad</th>
                                    <th className="text-left">Des 20, 22:00</th>
                                    <th className="text-right">Rp.22.000</th>
                                    <th className="text-left pl-10">Completed</th>
                                    <th className="pr-14">1</th>
                                </tr>
                                <tr className="border-b *:py-2 *:font-sans *:font-[400] *:text-base">
                                    <th>3</th>
                                    <th className="flex flex-col">
                                        <div className="flex flex-row items-center py-2">
                                            <div className="bg-CaffeLatte bg-cover w-8 h-8"/>
                                            <h1 className="pl-2 font-sans font-[500] text-base">Coffee Latte</h1>
                                        </div>
                                    </th>
                                    <th className="text-left">Risky Muhammad</th>
                                    <th className="text-left">Des 20, 22:00</th>
                                    <th className="text-right">Rp.22.000</th>
                                    <th className="text-left pl-10">Pending</th>
                                    <th className="pr-14">1</th>
                                </tr>
                                <tr className="border-b *:py-2 *:font-sans *:font-[400] *:text-base">
                                    <th>4</th>
                                    <th className="flex flex-col">
                                        <div className="flex flex-row items-center py-2">
                                            <div className="bg-CaffeLatte bg-cover w-8 h-8"/>
                                            <h1 className="pl-2 font-sans font-[500] text-base">Coffee Latte</h1>
                                        </div>
                                    </th>
                                    <th className="text-left">Risky Muhammad</th>
                                    <th className="text-left">Des 20, 22:00</th>
                                    <th className="text-right">Rp.22.000</th>
                                    <th className="text-left pl-10">Completed</th>
                                    <th className="pr-14">1</th>
                                </tr>
                                <tr className="border-b *:py-2 *:font-sans *:font-[400] *:text-base">
                                    <th>5</th>
                                    <th className="flex flex-col">
                                        <div className="flex flex-row items-center py-2">
                                            <div className="bg-CaffeLatte bg-cover w-8 h-8"/>
                                            <h1 className="pl-2 font-sans font-[500] text-base">Coffee Latte</h1>
                                        </div>
                                    </th>
                                    <th className="text-left">Risky Muhammad</th>
                                    <th className="text-left">Des 20, 22:00</th>
                                    <th className="text-right">Rp.22.000</th>
                                    <th className="text-left pl-10">Completed</th>
                                    <th className="pr-14">1</th>
                                </tr>
                                <tr className="border-b *:py-2 *:font-sans *:font-[400] *:text-base">
                                    <th>6</th>
                                    <th className="flex flex-col">
                                        <div className="flex flex-row items-center py-2">
                                            <div className="bg-CaffeLatte bg-cover w-8 h-8"/>
                                            <h1 className="pl-2 font-sans font-[500] text-base">Coffee Latte</h1>
                                        </div>
                                        <div className="flex flex-row items-center py-2">
                                            <div className="bg-RotiBakar bg-cover w-8 h-8"/>
                                            <h1 className="pl-2 font-sans font-[500] text-base">Roti Bakar</h1>
                                        </div>
                                    </th>
                                    <th className="text-left">Risky Muhammad</th>
                                    <th className="text-left">Des 20, 22:00</th>
                                    <th className="text-right">Rp.44.000</th>
                                    <th className="text-left pl-10">Completed</th>
                                    <th className="pr-14">2</th>
                                </tr>
                                <tr className="border-b *:py-2 *:font-sans *:font-[400] *:text-base">
                                    <th>7</th>
                                    <th className="flex flex-col">
                                        <div className="flex flex-row items-center py-2">
                                            <div className="bg-Alfredo bg-cover w-8 h-8"/>
                                            <h1 className="pl-2 font-sans font-[500] text-base">Pasta Alfredo</h1>
                                        </div>
                                    </th>
                                    <th className="text-left">Hilmi Bayu wdwawa</th>
                                    <th className="text-left">Oct 27, 16:21</th>
                                    <th className="text-right">Rp.31.000</th>
                                    <th className="text-left pl-10">Completed</th>
                                    <th className="pr-14">1</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <nav className="mt-5 flex items-center justify-between text-sm" aria-label="Page navigation example">
                            <div className="flex flex-row *:font-sans gap-1">
                                <h1>Showing</h1>
                                <h1 className="font-bold">1-5</h1>
                                <h1>of</h1>
                                <h1 className="font-bold">12</h1>
                            </div>

                            <ul class="list-style-none flex">
                            <li>
                                <a href="#!" className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-black transition-all duration-300 hover:bg-black hover:text-white">
                                Previous
                                </a>
                            </li>
                            <li aria-current="page">
                                <a href="#!" className="relative block rounded bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 transition-all duration-300">
                                1
                                <span class="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]">
                                    (current)
                                </span>
                                </a>
                            </li>
                            <li>
                                <a href="#!"className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-black transition-all duration-300 hover:bg-black hover:text-white">
                                2
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-black transition-all duration-300 hover:bg-black hover:text-white">
                                3
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-black transition-all duration-300 hover:bg-black hover:text-white">
                                Next
                                </a>    
                            </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;