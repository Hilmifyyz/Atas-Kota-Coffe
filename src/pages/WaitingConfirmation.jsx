import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const WaitingConfirmation = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const orderId = location.state?.orderId;

    useEffect(() => {
        if (!user || !orderId) {
            navigate('/');
            return;
        }

        // Subscribe to order updates
        const unsubscribe = onSnapshot(doc(db, "orders", orderId), (doc) => {
            if (doc.exists()) {
                const orderData = { id: doc.id, ...doc.data() };
                setOrder(orderData);
                setLoading(false);

                // If order is paid, redirect to complete payment
                if (orderData.status === 'paid') {
                    navigate('/complete-payment', { state: { orderId: doc.id } });
                }
            } else {
                console.error("Order not found");
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [orderId, user, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFFBF2] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E6D5B8]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFBF2] flex items-center justify-center p-4 pt-20">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 bg-[#E6D5B8] bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                            <div className="w-16 h-16 bg-[#E6D5B8] bg-opacity-40 rounded-full flex items-center justify-center animate-pulse">
                                <svg className="w-8 h-8 text-[#997B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Waiting for Payment Confirmation</h1>
                    <p className="text-gray-600">
                        Please proceed to the cashier to complete your payment
                    </p>
                </div>

                {/* Order Number Section */}
                <div className="bg-[#FFFBF2] rounded-xl p-4 mb-6 text-center border border-[#E6D5B8]">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-[#997B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span className="text-sm text-gray-600">Order Number</span>
                    </div>
                    <p className="text-2xl font-bold text-[#997B66] font-mono">#{order.orderNumber}</p>
                </div>

                {/* Order Details Section */}
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
                    <div className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E6D5B8] bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#997B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">Customer Name</p>
                            <p className="font-medium text-gray-900">{order.customerName}</p>
                        </div>
                    </div>

                    <div className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#E6D5B8] bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#997B66]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">Table Number</p>
                            <p className="font-medium text-gray-900">{order.seatNumber}</p>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Amount</span>
                            <span className="text-xl font-bold text-[#997B66]">
                                Rp {order.total.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#E6D5B8] bg-opacity-20 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 bg-[#997B66] rounded-full animate-pulse"></div>
                        <p className="text-sm text-gray-600">
                            Waiting for cashier confirmation...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingConfirmation; 