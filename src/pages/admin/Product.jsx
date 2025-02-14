import { Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { BarsArrowDownIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/20/solid'
import { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "../../firebase";
import { MdDashboard, MdShoppingCart, MdHistory, MdInventory, MdPayment } from "react-icons/md";

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const productsData = await getProducts();
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
        
        setDeleteLoading(productId);
        try {
            await deleteProduct(productId);
            await fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product. Please try again.");
        } finally {
            setDeleteLoading(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    };

    const handleEdit = (product) => {
        // Store the product data in localStorage for the edit page
        localStorage.setItem('editProduct', JSON.stringify(product));
        // Navigate to edit page
        window.location.href = `/admin/product/edit/${product.id}`;
    };

    return (
        <div className="min-h-screen bg-brownpage flex">
            {/* Mobile Menu Button */}
            <button
                className="fixed top-4 left-4 p-2 rounded-lg bg-white shadow-lg md:hidden z-50"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Desktop Sidebar */}
            <div className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r-2 border-[#D9D9D9] transform transition-transform duration-200 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            } z-40`}>
                <div className="flex flex-col h-full">
                    <div className="text-center py-8 border-b border-gray-200">
                        <h1 className="font-sans font-[700] text-[24px]">Dashboard Admin</h1>
                    </div>
                    <nav className="flex-1 mt-10">
                        <Link 
                            to="/admin/product" 
                            className="flex items-center px-4 py-2 mx-4 rounded-xl bg-[#EBEBEB] hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdInventory className="w-6 h-6 mr-2" />
                            <span className="font-sans font-[600] text-xl">Products</span>
                        </Link>

                        <Link 
                            to="/admin/orders" 
                            className="flex items-center px-4 py-2 mx-4 mt-4 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdShoppingCart className="w-6 h-6 mr-2" />
                            <span className="font-sans font-[600] text-xl">Orders</span>
                        </Link>

                        <Link 
                            to="/admin/order-confirmation" 
                            className="flex items-center px-4 py-2 mx-4 mt-4 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdPayment className="w-6 h-6 mr-2" />
                            <span className="font-sans font-[600] text-xl text-left">Payment Confirmation</span>
                        </Link>

                        <Link 
                            to="/admin/transaction" 
                            className="flex items-center px-4 py-2 mx-4 mt-4 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdDashboard className="w-6 h-6 mr-2" />
                            <span className="font-sans font-[600] text-xl">Transaction</span>
                        </Link>

                        <Link 
                            to="/admin/history" 
                            className="flex items-center px-4 py-2 mx-4 mt-4 rounded-xl hover:bg-[#d9d9d9] transition-colors"
                        >
                            <MdHistory className="w-6 h-6 mr-2" />
                            <span className="font-sans font-[600] text-xl">Riwayat</span>
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="font-sans font-[700] text-2xl md:text-3xl mb-6 mt-16 md:mt-0">Products</h1>
                    
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            {/* Filter Dropdown */}
                            <div className="w-full md:w-48">
                                <Menu as="div" className="relative w-full inline-block text-left">
                                    <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-white px-3 py-2 font-sans font-[600] shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                        Filter
                                        <BarsArrowDownIcon className="-mr-1 mt-1 size-5 text-gray-400" />
                                    </MenuButton>
                                    <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5">
                                        <div className="py-1">
                                            {['category', 'name', 'price', 'date'].map((type) => (
                                                <MenuItem key={type}>
                                                    <button 
                                                        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </button>
                                                </MenuItem>
                                            ))}
                                        </div>
                                    </MenuItems>
                                </Menu>
                            </div>

                            {/* Add Product Button */}
                            <div className="w-full md:w-48">
                                <Link to="/admin/product/add" className="block w-full">
                                    <div className="bg-white rounded-lg border-2 py-2 px-4 text-center">
                                        <h1 className="font-sans font-[600] text-xl">+ Add Product</h1>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#EDECEC] text-left">
                                        <th className="p-4 font-semibold whitespace-nowrap">ID</th>
                                        <th className="p-4 font-semibold whitespace-nowrap">Image</th>
                                        <th className="p-4 font-semibold whitespace-nowrap">Product</th>
                                        <th className="p-4 font-semibold whitespace-nowrap hidden md:table-cell">Description</th>
                                        <th className="p-4 font-semibold whitespace-nowrap">Price</th>
                                        <th className="p-4 font-semibold whitespace-nowrap hidden md:table-cell">Category</th>
                                        <th className="p-4 font-semibold whitespace-nowrap hidden md:table-cell">Date</th>
                                        <th className="p-4 font-semibold whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-4">
                                                <div className="flex justify-center items-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : products.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-8">
                                                <div className="text-gray-500">No products found</div>
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product, index) => (
                                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                                <td className="p-4 whitespace-nowrap">{index + 1}</td>
                                                <td className="p-4">
                                                    <img 
                                                        src={product.imageUrl} 
                                                        alt={product.title}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                </td>
                                                <td className="p-4 whitespace-nowrap">{product.title}</td>
                                                <td className="p-4 hidden md:table-cell">
                                                    <div className="max-w-xs truncate">{product.description}</div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap">Rp. {product.price.toLocaleString()}</td>
                                                <td className="p-4 hidden md:table-cell whitespace-nowrap">{product.category}</td>
                                                <td className="p-4 hidden md:table-cell whitespace-nowrap">{formatDate(product.createdAt)}</td>
                                                <td className="p-4 whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                                        >
                                                            <PencilSquareIcon className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            disabled={deleteLoading === product.id}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full disabled:opacity-50"
                                                        >
                                                            {deleteLoading === product.id ? (
                                                                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <TrashIcon className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="flex justify-around items-center py-2">
                    <Link to="/admin/product" className="flex flex-col items-center p-2">
                        <MdInventory className="w-6 h-6 text-gray-600" />
                        <span className="text-xs mt-1">Products</span>
                    </Link>
                    <Link to="/admin/orders" className="flex flex-col items-center p-2">
                        <MdShoppingCart className="w-6 h-6 text-gray-600" />
                        <span className="text-xs mt-1">Orders</span>
                    </Link>
                    <Link to="/admin/order-confirmation" className="flex flex-col items-center p-2">
                        <MdPayment className="w-6 h-6" />
                        <span className="text-xs mt-1">Payment <br/> Confirmation</span>
                    </Link>
                    <Link to="/admin/transaction" className="flex flex-col items-center p-2">
                        <MdDashboard className="w-6 h-6 text-gray-600" />
                        <span className="text-xs mt-1">Transaction</span>
                    </Link>
                    <Link to="/admin/history" className="flex flex-col items-center p-2">
                        <MdHistory className="w-6 h-6 text-gray-600" />
                        <span className="text-xs mt-1">Riwayat</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Admin;

