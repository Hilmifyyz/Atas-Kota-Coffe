import { Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { BarsArrowDownIcon } from '@heroicons/react/20/solid'



const Admin = () => {
    return (
        <div className="bg-brownpage min-h-screen absolute overflow-hidden overflow-x-hidden top-0 left-0 right-0 flex flex-row">
            {/* Side Bar / Navbar */}
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
            {/* Content */}
            <div className="w-full justify-center items-center">
                <h1 className="font-sans font-[700] text-3xl my-6">Products</h1>
                <div className="mx-10">
                    <div className="flex flex-row place-content-between">
                        {/* Litteraly only dropdown menu */}
                        <div className="w-48">
                            <Menu as="div" className="relative w-full inline-block text-left">
                                <div>
                                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-white px-3 py-2 font-sans font-[600] shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    Filter
                                    <BarsArrowDownIcon aria-hidden="true" className="-mr-1 mt-1 size-5 text-gray-400" />
                                    </MenuButton>
                                </div>

                                
                                <MenuItems
                                    transition
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                                    <div className="py-1">
                                    <MenuItem>
                                        <button className="block w-full px-4 py-2 font-sans font-[500] text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none">
                                        Category
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button className="block w-full px-4 py-2 font-sans font-[500] text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none">
                                        Product Name
                                        </button>
                                    </MenuItem>
                                    <MenuItem>
                                        <button className="block w-full px-4 py-2 font-sans font-[500] text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none">
                                        Price
                                        </button>
                                    </MenuItem>
                                    <form action="#" method="POST">
                                        <MenuItem>
                                        <button className="block w-full px-4 py-2 font-sans font-[500] text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none">
                                        Date
                                        </button>
                                        </MenuItem>
                                    </form>
                                    </div>
                                </MenuItems>
                            </Menu> 
                        </div>
                        <div className="w-48 bg-white rounded-lg border-2 py-2 px-4">
                            <Link to="/admin/product/add" className="rounded-lg w-full">
                                <h1 className="font-sans font-[600] text-xl">+  Add Product</h1>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <table className="table-auto w-full mt-10 shadow-md">
                            <thead>
                                <tr className="bg-[#EDECEC] border-b-2 *:py-5 pl-2">
                                    <th className="min-w-[30px] ">id</th>
                                    <th>Image</th>
                                    <th>Product name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Year</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white *:border-b-2 *:py-10 ">
                                <tr className=" *:py-4 *:font-sans *:font-[400]">
                                    <td className="border-r-2">1</td>
                                    <td>URL: w3jkl7hfbkei9</td>
                                    <td>Coffee Latte</td>
                                    <td>Coffe Latte dengan cream</td>
                                    <td>Rp. 22.000</td>
                                    <td>Coffee</td>
                                    <td>Desember 25,2024 at 21:40</td>
                                </tr>
                                <tr className=" *:py-4 *:font-sans *:font-[400]">
                                    <td className="border-r-2">1</td>
                                    <td>URL: w3jkl7hfbkei9</td>
                                    <td>Coffee Latte</td>
                                    <td>Coffe Latte dengan cream</td>
                                    <td>Rp. 22.000</td>
                                    <td>Coffee</td>
                                    <td>Desember 25,2024 at 21:40</td>
                                </tr>
                                <tr className=" *:py-4 *:font-sans *:font-[400]">
                                    <td className="border-r-2">1</td>
                                    <td>URL: w3jkl7hfbkei9</td>
                                    <td>Coffee Latte</td>
                                    <td>Coffe Latte dengan cream</td>
                                    <td>Rp. 22.000</td>
                                    <td>Coffee</td>
                                    <td>Desember 25,2024 at 21:40</td>
                                </tr>
                                <tr className=" *:py-4 *:font-sans *:font-[400]">
                                    <td className="border-r-2">1</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr className=" *:py-4 *:font-sans *:font-[400]">
                                    <td className="border-r-2">1</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr className=" *:py-4 *:font-sans *:font-[400]">
                                    <td className="border-r-2">1</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr className=" *:py-4 *:font-sans *:font-[400]">
                                    <td className="border-r-2">1</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr className=" *:py-4 *:font-sans *:font-[400]">
                                    <td className="border-r-2">1</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr className=" *:py-4 *:font-sans *:font-[400]">
                                    <td className="border-r-2">1</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Admin;

