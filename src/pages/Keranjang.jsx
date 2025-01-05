import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Keranjang = () => {
    const { user } = useAuth();
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

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
    }, [user, navigate]);

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
            alert('Please fill in all fields and select a payment method');
            return;
        }

        if (orderDetails.paymentMethod === 'cash') {
            try {
                setProcessingPayment(true);
                const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
                const total = calculateTotal();

                // Create order in Firestore for cash payment
                const orderRef = await addDoc(collection(db, "orders"), {
                    userId: user.uid,
                    items: selectedCartItems,
                    total: total,
                    status: 'pending',
                    paymentMethod: 'cash',
                    createdAt: new Date().toISOString(),
                    customerName: orderDetails.customerName,
                    seatNumber: orderDetails.seatNumber,
                    orderNumber: Math.floor(100000 + Math.random() * 900000).toString() // 6-digit order number
                });

                // Clear cart items
                await Promise.all(
                    Array.from(selectedItems).map(itemId =>
                        removeFromCart(itemId)
                    )
                );

                setSelectedItems(new Set());
                setShowOrderForm(false);
                navigate('/complete-payment', { state: { orderId: orderRef.id } });
            } catch (error) {
                console.error('Error processing cash order:', error);
                alert('Failed to process order: ' + error.message);
            } finally {
                setProcessingPayment(false);
            }
        } else {
            // For e-money payment, proceed with Midtrans
            handlePayment();
        }
    };

    const handlePayment = async () => {
        try {
            setProcessingPayment(true);
            const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
            const total = calculateTotal();
            const orderNumber = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit order number

            // Create order in Firestore with additional details
            const orderRef = await addDoc(collection(db, "orders"), {
                userId: user.uid,
                items: selectedCartItems,
                total: total,
                status: 'pending',
                createdAt: new Date().toISOString(),
                customerName: orderDetails.customerName,
                seatNumber: orderDetails.seatNumber,
                orderNumber: orderNumber,
                paymentMethod: 'e-money'
            });

            // Prepare items for Midtrans
            const itemDetails = selectedCartItems.map(item => ({
                id: String(item.id || item.productId),
                price: parseInt(item.price),
                quantity: parseInt(item.quantity),
                name: String(item.title || 'Product')
            }));

            // Get payment token from your backend
            const response = await fetch('http://localhost:5000/api/payment/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    orderId: orderRef.id,
                    amount: parseInt(total),
                    items: itemDetails,
                    customerDetails: {
                        first_name: user.displayName || 'Customer',
                        email: user.email || 'customer@example.com'
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get payment token');
            }

            const { token } = await response.json();
            console.log('Payment token received:', token);

            if (!token) {
                throw new Error('No payment token received from server');
            }

            // Check if snap is loaded
            if (typeof window.snap === 'undefined') {
                throw new Error('Midtrans Snap is not loaded yet. Please try again.');
            }

            // Open Midtrans Snap payment page
            window.snap.pay(token.token || token, {
                enabledPayments: ['credit_card', 'gopay', 'shopeepay', 'qris'],
                onSuccess: async (result) => {
                    try {
                        await updateDoc(doc(db, "orders", orderRef.id), {
                            status: 'paid',
                            paymentDetails: result
                        });

                        await Promise.all(
                            Array.from(selectedItems).map(itemId =>
                                removeFromCart(itemId)
                            )
                        );

                        setSelectedItems(new Set());
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
                        await updateDoc(doc(db, "orders", orderRef.id), {
                            status: 'pending',
                            paymentDetails: result
                        });
                        alert('Payment pending. Please complete your payment.');
                    } catch (error) {
                        console.error('Error updating order status:', error);
                    } finally {
                        setProcessingPayment(false);
                    }
                },
                onError: async (result) => {
                    try {
                        await updateDoc(doc(db, "orders", orderRef.id), {
                            status: 'failed',
                            paymentDetails: result
                        });
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                        <form onSubmit={handleOrderFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    value={orderDetails.customerName}
                                    onChange={(e) => setOrderDetails(prev => ({
                                        ...prev,
                                        customerName: e.target.value
                                    }))}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    No Tempat Duduk
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    value={orderDetails.seatNumber}
                                    onChange={(e) => setOrderDetails(prev => ({
                                        ...prev,
                                        seatNumber: e.target.value
                                    }))}
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Metode Pembayaran
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cash"
                                            checked={orderDetails.paymentMethod === 'cash'}
                                            onChange={(e) => setOrderDetails(prev => ({
                                                ...prev,
                                                paymentMethod: e.target.value
                                            }))}
                                            className="mr-2"
                                        />
                                        <span>Bayar di Kasir</span>
                                    </label>
                                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="emoney"
                                            checked={orderDetails.paymentMethod === 'emoney'}
                                            onChange={(e) => setOrderDetails(prev => ({
                                                ...prev,
                                                paymentMethod: e.target.value
                                            }))}
                                            className="mr-2"
                                        />
                                        <span>E-Money Payment</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowOrderForm(false)}
                                    className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#E6D5B8] text-black rounded-lg hover:bg-[#d4b87c]"
                                    disabled={processingPayment}
                                >
                                    {processingPayment ? 'Processing...' : 'Proceed to Payment'}
                                </button>
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