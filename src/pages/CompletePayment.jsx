import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const CompletePayment = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!location.state?.orderId) {
                    navigate('/menu');
                    return;
                }

                const orderDoc = await getDoc(doc(db, "orders", location.state.orderId));
                if (!orderDoc.exists()) {
                    throw new Error("Order not found");
                }

                setOrder({
                    id: orderDoc.id,
                    ...orderDoc.data()
                });
            } catch (error) {
                console.error("Error fetching order:", error);
                alert("Failed to load order details");
                navigate('/menu');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [location.state, navigate]);

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    if (loading) {
        return (
            <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2] flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2] pt-32 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Success Message */}
                <div className="bg-white rounded-lg p-6 mb-8 text-center shadow-lg">
                    <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-gray-600">Your order has been confirmed and is being processed.</p>
                </div>

                {/* Invoice Card */}
                <div className="bg-white rounded-lg p-8 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Invoice</h2>
                            <p className="text-gray-600">Order #{order.orderNumber}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">Atas Kota Coffee</p>
                            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                    </div>

                    <div className="border-t border-b py-4 mb-4">
                        <div className="mb-4">
                            <p className="font-semibold">Customer Details:</p>
                            <p>Name: {order.customerName}</p>
                            <p>Seat Number: {order.seatNumber}</p>
                            <p>Payment Method: {order.paymentMethod}</p>
                            <p>Status: <span className="text-green-500 font-semibold">Paid</span></p>
                        </div>

                        <table className="w-full mb-4">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Item</th>
                                    <th className="text-center py-2">Qty</th>
                                    <th className="text-right py-2">Price</th>
                                    <th className="text-right py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-2">{item.title}</td>
                                        <td className="text-center py-2">{item.quantity}</td>
                                        <td className="text-right py-2">Rp {item.price.toLocaleString()}</td>
                                        <td className="text-right py-2">Rp {(item.price * item.quantity).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="text-right font-bold py-2">Total:</td>
                                    <td className="text-right font-bold py-2">Rp {order.total.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="text-center text-sm text-gray-600 mb-6">
                        <p>Thank you for your order!</p>
                        <p>Please show this invoice to the cashier.</p>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Print Invoice
                        </button>
                        <button
                            onClick={() => navigate('/menu')}
                            className="px-4 py-2 bg-[#E6D5B8] text-black rounded hover:bg-[#d4b87c]"
                        >
                            Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletePayment; 