import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";

const Keranjang = () => {
    const { cartItems, loading, removeFromCart, updateQuantity } = useCart();
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
                paymentMethod: orderDetails.paymentMethod
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
                navigate('/waiting-confirmation', { 
                    state: { 
                        orderId: orderRef.id,
                        customerName: orderDetails.customerName,
                        seatNumber: orderDetails.seatNumber
                    } 
                });
            } else {
                // For e-money payment
                try {
                    // First check if the server is available
                    const serverCheck = await fetch('http://localhost:5000/health-check', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!serverCheck.ok) {
                        throw new Error('Payment server is currently unavailable. Please try cash payment or try again later.');
                    }

                    // Check if snap is loaded
                    if (typeof window.snap === 'undefined') {
                        throw new Error('Payment system is not ready. Please try cash payment or try again later.');
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
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || 'Failed to generate payment token. Please try cash payment.');
                    }

                    const { token } = await response.json();

                    if (!token) {
                        throw new Error('Invalid payment token received. Please try cash payment.');
                    }

                    // Open Midtrans Snap payment page
                    window.snap.pay(token, {
                        onSuccess: async (result) => {
                            try {
                                // Update order status
                                await addDoc(collection(db, "orders"), {
                                    ...orderData,
                                    status: 'paid',
                                    paymentDetails: result,
                                    updatedAt: new Date().toISOString()
                                });

                                // Delete the pending order
                                try {
                                    await deleteDoc(doc(db, "orders", orderRef.id));
                                } catch (error) {
                                    console.error('Error deleting old order:', error);
                                }

                                navigate('/complete-payment', { 
                                    state: { 
                                        orderId: orderRef.id,
                                        customerName: orderDetails.customerName,
                                        seatNumber: orderDetails.seatNumber
                                    } 
                                });
                            } catch (error) {
                                console.error('Error updating order status:', error);
                                alert('Your payment was successful but we encountered an error updating the order. Please contact staff with your order number: ' + orderNumber);
                            } finally {
                                setProcessingPayment(false);
                            }
                        },
                        onPending: async (result) => {
                            try {
                                await addDoc(collection(db, "orders"), {
                                    ...orderData,
                                    status: 'pending',
                                    paymentDetails: result,
                                    updatedAt: new Date().toISOString()
                                });

                                try {
                                    await deleteDoc(doc(db, "orders", orderRef.id));
                                } catch (error) {
                                    console.error('Error deleting old order:', error);
                                }

                                alert('Payment is pending. Please complete your payment using the provided instructions. Your order number is: ' + orderNumber);
                                navigate('/waiting-confirmation', { 
                                    state: { 
                                        orderId: orderRef.id,
                                        customerName: orderDetails.customerName,
                                        seatNumber: orderDetails.seatNumber
                                    } 
                                });
                            } catch (error) {
                                console.error('Error updating order status:', error);
                                alert('Payment is pending. Please complete your payment and contact staff with your order number: ' + orderNumber);
                            } finally {
                                setProcessingPayment(false);
                            }
                        },
                        onError: async (result) => {
                            try {
                                // Update order status to failed
                                await addDoc(collection(db, "orders"), {
                                    ...orderData,
                                    status: 'failed',
                                    paymentDetails: result,
                                    updatedAt: new Date().toISOString()
                                });

                                try {
                                    await deleteDoc(doc(db, "orders", orderRef.id));
                                } catch (error) {
                                    console.error('Error deleting old order:', error);
                                }

                                alert('Payment failed. Please try again or choose cash payment. Your order number was: ' + orderNumber);
                            } catch (error) {
                                console.error('Error updating order status:', error);
                            } finally {
                                setProcessingPayment(false);
                            }
                        },
                        onClose: () => {
                            // If the user closes the payment window, suggest cash payment
                            alert('Payment window closed. You can try again or proceed with cash payment.');
                            setProcessingPayment(false);
                        }
                    });
                } catch (error) {
                    console.error('Error processing payment:', error);
                    
                    // Show a user-friendly error message with alternative
                    const errorMessage = 'Payment processing failed: ' + error.message + 
                        '\n\nWould you like to switch to cash payment instead?';
                    
                    if (window.confirm(errorMessage)) {
                        // Update order to cash payment
                        try {
                            await addDoc(collection(db, "orders"), {
                                ...orderData,
                                paymentMethod: 'cash',
                                updatedAt: new Date().toISOString()
                            });

                            try {
                                await deleteDoc(doc(db, "orders", orderRef.id));
                            } catch (error) {
                                console.error('Error deleting old order:', error);
                            }

                            navigate('/waiting-confirmation', { 
                                state: { 
                                    orderId: orderRef.id,
                                    customerName: orderDetails.customerName,
                                    seatNumber: orderDetails.seatNumber
                                } 
                            });
                        } catch (error) {
                            console.error('Error updating to cash payment:', error);
                            alert('Error switching to cash payment. Please try placing your order again.');
                        }
                    }
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b69d74]"></div>
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
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 p-2"
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
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#b69d74] focus:ring focus:ring-[#b69d74] focus:ring-opacity-30 transition-all duration-200 pl-10"
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
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#b69d74] focus:ring focus:ring-[#b69d74] focus:ring-opacity-30 transition-all duration-200 pl-10"
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
                                            className="w-4 h-4 text-[#b69d74] border-gray-300 focus:ring-[#b69d74]"
                                        />
                                        <div className="ml-3 flex-1">
                                            <span className="font-medium text-gray-900">Bayar di Kasir</span>
                                            <p className="text-sm text-gray-500">Pay at the cashier counter</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 absolute right-4 text-[#b69d74] transition-opacity">
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
                                            className="w-4 h-4 text-[#b69d74] border-gray-300 focus:ring-[#b69d74]"
                                        />
                                        <div className="ml-3 flex-1">
                                            <span className="font-medium text-gray-900">E-Money Payment</span>
                                            <p className="text-sm text-gray-500">Pay using digital payment methods</p>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 absolute right-4 text-[#b69d74] transition-opacity">
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
                                        <p className="text-2xl font-bold text-gray-900">Rp {calculateTotal().toLocaleString()}</p>
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
                                        className="flex-1 px-4 py-3 bg-[#b69d74] text-white rounded-xl hover:bg-[#a38a67] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {processingPayment ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

            <div className="container mx-auto px-4 pt-32 pb-16 max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleDeleteItems}
                            disabled={selectedItems.size === 0}
                            className="text-red-500 hover:text-red-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Selected
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Section - Cart Items */}
                    <div className="flex-1">
                        {/* Header with Select All */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded text-[#b69d74] focus:ring-[#b69d74]"
                                        checked={isAllSelected}
                                        onChange={toggleSelectAll}
                                    />
                                    <span className="font-medium text-gray-700">Select All Items</span>
                                </div>
                                <span className="text-sm text-gray-500">{cartItems.length} items</span>
                            </div>
                        </div>

                        {/* Cart Items */}
                        {cartItems.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                                <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
                                <button
                                    onClick={() => navigate('/menu')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#b69d74] hover:bg-[#a38a67] transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex gap-4">
                                            <input 
                                                type="checkbox" 
                                                className="w-5 h-5 mt-2 rounded text-[#b69d74] focus:ring-[#b69d74]"
                                                checked={selectedItems.has(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                            />
                                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                                <img 
                                                    src={item.imageUrl} 
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                                <div className="flex justify-between items-center mt-4">
                                                    <span className="font-medium text-gray-900">
                                                        Rp {item.price.toLocaleString()}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        >
                                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                            </svg>
                                                        </button>
                                                        <input 
                                                            type="text" 
                                                            value={item.quantity} 
                                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                                            className="w-12 h-8 text-center border rounded-lg" 
                                                        />
                                                        <button 
                                                            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        >
                                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Section - Summary */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Selected Items</span>
                                    <span className="font-medium text-gray-900">{selectedItems.size} items</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-900 font-medium">Total</span>
                                    <span className="text-xl font-bold text-gray-900">
                                        Rp {calculateTotal().toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={() => setShowOrderForm(true)}
                                disabled={selectedItems.size === 0 || processingPayment}
                                className="w-full py-3 bg-[#b69d74] text-white rounded-xl font-medium hover:bg-[#a38a67] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processingPayment ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Proceed to Checkout</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Keranjang;