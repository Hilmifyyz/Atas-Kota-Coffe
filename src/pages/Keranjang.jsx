import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Keranjang = () => {
    const { cartItems, loading, removeFromCart, updateQuantity } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        customerName: '',
        seatNumber: '',
        paymentMethod: ''
    });

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await updateQuantity(itemId, newQuantity);
        } catch (error) {
            console.error("Error updating quantity:", error);
            alert("Failed to update quantity. Please try again.");
        }
    };

    const handleDeleteItems = async () => {
        try {
            const deletePromises = Array.from(selectedItems).map(itemId =>
                removeFromCart(itemId)
            );
            await Promise.all(deletePromises);
            setSelectedItems(new Set());
        } catch (error) {
            console.error("Error deleting items:", error);
            alert("Failed to delete items. Please try again.");
        }
    };

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(cartItems.map(item => item.id)));
        }
        setIsAllSelected(!isAllSelected);
    };

    const toggleSelectItem = (itemId) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
        setIsAllSelected(newSelected.size === cartItems.length);
    };

    const calculateTotal = () => {
        return cartItems
            .filter(item => selectedItems.has(item.id))
            .reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleOrderFormSubmit = async (e) => {
        e.preventDefault();
        if (!orderDetails.customerName || !orderDetails.seatNumber || !orderDetails.paymentMethod) {
            alert('Please fill in all fields');
            return;
        }

        try {
            setProcessingPayment(true);
            const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
            const total = calculateTotal();
            const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

            // Create order in Firestore
            const orderData = {
                items: selectedCartItems,
                total: total,
                status: 'pending',
                createdAt: new Date().toISOString(),
                customerName: orderDetails.customerName,
                seatNumber: orderDetails.seatNumber,
                orderNumber: orderNumber,
                paymentMethod: orderDetails.paymentMethod,
                userId: user ? user.uid : null // Track user ID if authenticated
            };

            const orderRef = await addDoc(collection(db, "orders"), orderData);

            // Clear cart items
            await Promise.all(
                Array.from(selectedItems).map(itemId =>
                    removeFromCart(itemId)
                )
            );

            setSelectedItems(new Set());
            setShowOrderForm(false);

            // Handle different payment methods
            if (orderDetails.paymentMethod === 'cash') {
                navigate('/waiting-confirmation', { state: { orderId: orderRef.id } });
            } else {
                // For e-money payment, proceed with Midtrans
                try {
                    // Check if snap is loaded
                    if (typeof window.snap === 'undefined') {
                        throw new Error('Midtrans Snap is not loaded yet. Please try again.');
                    }

                    // Get token from server
                    const response = await fetch('http://localhost:5000/generate-token', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            orderId: orderRef.id,
                            amount: total,
                            items: selectedCartItems.map(item => ({
                                id: String(item.id),
                                price: parseInt(item.price),
                                quantity: parseInt(item.quantity),
                                name: String(item.title)
                            })),
                            customerDetails: {
                                first_name: orderDetails.customerName
                            }
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to generate payment token');
                    }

                    const { token } = await response.json();

                    // Open Midtrans Snap payment page
                    window.snap.pay(token, {
                        onSuccess: async (result) => {
                            try {
                                // Update the existing order instead of creating a new one
                                await addDoc(collection(db, "orders"), {
                                    ...orderData,
                                    status: 'paid',
                                    paymentDetails: result,
                                    updatedAt: new Date().toISOString()
                                });

                                // Delete the old order
                                try {
                                    await deleteDoc(doc(db, "orders", orderRef.id));
                                } catch (error) {
                                    console.error('Error deleting old order:', error);
                                }

                                navigate('/complete-payment', { state: { orderId: orderRef.id } });
                            } catch (error) {
                                console.error('Error updating order status:', error);
                                alert('Payment recorded but failed to update order status.');
                            } finally {
                                setProcessingPayment(false);
                            }
                        },
                        onPending: async (result) => {
                            try {
                                // Update the existing order instead of creating a new one
                                await addDoc(collection(db, "orders"), {
                                    ...orderData,
                                    status: 'pending',
                                    paymentDetails: result,
                                    updatedAt: new Date().toISOString()
                                });

                                // Delete the old order
                                try {
                                    await deleteDoc(doc(db, "orders", orderRef.id));
                                } catch (error) {
                                    console.error('Error deleting old order:', error);
                                }

                                alert('Payment pending. Please complete your payment.');
                            } catch (error) {
                                console.error('Error updating order status:', error);
                            } finally {
                                setProcessingPayment(false);
                            }
                        },
                        onError: async (result) => {
                            try {
                                // Update the existing order instead of creating a new one
                                await addDoc(collection(db, "orders"), {
                                    ...orderData,
                                    status: 'failed',
                                    paymentDetails: result,
                                    updatedAt: new Date().toISOString()
                                });

                                // Delete the old order
                                try {
                                    await deleteDoc(doc(db, "orders", orderRef.id));
                                } catch (error) {
                                    console.error('Error deleting old order:', error);
                                }

                                alert('Payment failed. Please try again.');
                            } catch (error) {
                                console.error('Error updating order status:', error);
                            } finally {
                                setProcessingPayment(false);
                            }
                        },
                        onClose: () => {
                            setProcessingPayment(false);
                        }
                    });
                } catch (error) {
                    console.error('Error processing payment:', error);
                    alert('Failed to process payment: ' + error.message);
                    setProcessingPayment(false);
                }
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order: ' + error.message);
            setProcessingPayment(false);
        }
    };

    if (loading) {
        return (
            <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2] flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2]">
            {/* Order Form Modal */}
            {showOrderForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
                        <button
                            onClick={() => setShowOrderForm(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Complete Your Order</h2>
                            <p className="text-gray-600 mt-2">Please provide your details below</p>
                        </div>

                        <form onSubmit={handleOrderFormSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Nama
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E6D5B8] focus:ring focus:ring-[#E6D5B8] focus:ring-opacity-50 transition-colors pl-10"
                                            value={orderDetails.customerName}
                                            onChange={(e) => setOrderDetails(prev => ({
                                                ...prev,
                                                customerName: e.target.value
                                            }))}
                                            placeholder="Enter your name"
                                            required
                                        />
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        No Meja
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E6D5B8] focus:ring focus:ring-[#E6D5B8] focus:ring-opacity-50 transition-colors pl-10"
                                            value={orderDetails.seatNumber}
                                            onChange={(e) => setOrderDetails(prev => ({
                                                ...prev,
                                                seatNumber: e.target.value
                                            }))}
                                            placeholder="Enter your table number"
                                            required
                                        />
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <label className="block text-gray-700 text-sm font-semibold mb-3">
                                    Metode Pembayaran
                                </label>
                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cash"
                                            checked={orderDetails.paymentMethod === 'cash'}
                                            onChange={(e) => setOrderDetails(prev => ({
                                                ...prev,
                                                paymentMethod: e.target.value
                                            }))}
                                            className="w-4 h-4 text-[#E6D5B8] border-gray-300 focus:ring-[#E6D5B8]"
                                        />
                                        <div className="ml-3 flex-1">
                                            <span className="font-medium text-gray-900">Bayar di Kasir</span>
                                            <p className="text-sm text-gray-500">Pay at the cashier counter</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 absolute right-4 text-[#E6D5B8] transition-opacity">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="e-money"
                                            checked={orderDetails.paymentMethod === 'e-money'}
                                            onChange={(e) => setOrderDetails(prev => ({
                                                ...prev,
                                                paymentMethod: e.target.value
                                            }))}
                                            className="w-4 h-4 text-[#E6D5B8] border-gray-300 focus:ring-[#E6D5B8]"
                                        />
                                        <div className="ml-3 flex-1">
                                            <span className="font-medium text-gray-900">E-Money Payment</span>
                                            <p className="text-sm text-gray-500">Pay using digital payment methods</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 absolute right-4 text-[#E6D5B8] transition-opacity">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="border-t pt-6 mt-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="text-2xl font-bold text-gray-900">Rp. {calculateTotal().toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Selected Items</p>
                                        <p className="text-lg font-medium text-gray-900">{selectedItems.size} items</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowOrderForm(false)}
                                        className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processingPayment}
                                        className="flex-1 px-4 py-3 bg-[#E6D5B8] text-gray-900 rounded-xl hover:bg-[#d4b87c] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {processingPayment ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Proceed to Payment</span>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="pt-32 xl:px-56 lg:px-24 md:px-14 sm:px-20 px-4">
                <h1 className="text-left mb-8 font-sans font-[700] text-[36px]">Keranjang</h1>
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    {/* Left Section - Cart Items */}
                    <div className="flex-1">
                        {/* Header with Select All */}
                        <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-[#b1b1b1] mb-4">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    className="w-5 h-5"
                                    checked={isAllSelected}
                                    onChange={toggleSelectAll}
                                />
                                <span className="pl-4 font-sans font-[700] text-xl">Pilih Semua</span>
                            </div>
                            <button 
                                className="text-gray-600 pr-10 font-sans font-[700] text-xl"
                                onClick={handleDeleteItems}
                                disabled={selectedItems.size === 0}
                            >
                                Hapus
                            </button>
                        </div>

                        {/* Cart Items */}
                        {cartItems.length === 0 ? (
                            <div className="bg-white rounded-lg border border-[#b1b1b1] p-8 text-center">
                                <p className="text-gray-600 font-sans font-[500]">Your cart is empty</p>
                            </div>
                        ) : (
                            cartItems.map(item => (
                                <div key={item.id} className="bg-white rounded-lg border border-[#b1b1b1] p-4 mb-4">
                                    <div className="flex items-start gap-4">
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 mt-2"
                                            checked={selectedItems.has(item.id)}
                                            onChange={() => toggleSelectItem(item.id)}
                                        />
                                        <div 
                                            className="w-32 h-32 rounded-lg bg-center bg-cover bg-no-repeat"
                                            style={{ backgroundImage: `url(${item.imageUrl})` }}
                                        />
                                        <div className="flex-1 text-left">
                                            <h3 className="font-sans font-[700] text-lg">{item.title}</h3>
                                            <div className="flex justify-between items-center mt-4">
                                                <span className="font-sans font-[700]">Rp. {item.price.toLocaleString()}</span>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center">
                                                        <button 
                                                            className="w-8 h-8 border rounded-l-lg bg-[#FFFBF2]"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        >
                                                            -
                                                        </button>
                                                        <input 
                                                            type="text" 
                                                            value={item.quantity} 
                                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                                            className="w-12 h-8 text-center border-y bg-[#FFFBF2]" 
                                                        />
                                                        <button 
                                                            className="w-8 h-8 border rounded-r-lg bg-[#FFFBF2]"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right Section - Summary */}
                    <div className="w-full md:w-80">
                        <div className="bg-white rounded-lg border border-[#b1b1b1] p-4">
                            <h2 className="font-medium text-lg mb-4">Ringkasan</h2>
                            <div className="flex justify-between mb-4">
                                <span>Total</span>
                                <span className="font-medium">Rp. {calculateTotal().toLocaleString()}</span>
                            </div>
                            <button 
                                onClick={() => setShowOrderForm(true)}
                                disabled={selectedItems.size === 0 || processingPayment}
                                className="w-full bg-[#E6D5B8] text-black py-2 rounded-lg hover:bg-[#d4b87c] transition-colors disabled:opacity-50"
                            >
                                {processingPayment ? 'Processing...' : 'Pay Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Keranjang;