import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CompletePayment = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const receiptRef = useRef();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if we have the required state
                if (!location.state?.orderId || !location.state?.customerName || !location.state?.seatNumber) {
                    throw new Error("Missing required order information");
                }

                // First try to get the order directly by ID
                const orderDoc = await getDoc(doc(db, "orders", location.state.orderId));
                
                if (orderDoc.exists()) {
                    setOrder({
                        id: orderDoc.id,
                        ...orderDoc.data()
                    });
                    return;
                }

                // If order not found by ID, try to find it by customer details
                const ordersRef = collection(db, "orders");
                const q = query(
                    ordersRef,
                    where("customerName", "==", location.state.customerName),
                    where("seatNumber", "==", location.state.seatNumber),
                    where("status", "in", ["paid", "pending"])
                );

                const querySnapshot = await getDocs(q);
                
                if (querySnapshot.empty) {
                    throw new Error("Order not found. Please check with the staff.");
                }

                // Get the most recent order for this customer
                const orders = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt ? new Date(doc.data().createdAt) : new Date(0)
                }));

                // Sort by creation date (most recent first)
                orders.sort((a, b) => b.createdAt - a.createdAt);
                
                setOrder(orders[0]);

            } catch (error) {
                console.error("Error fetching order:", error);
                
                // Handle different types of errors
                if (error.code === 'permission-denied') {
                    setError("Access denied. Please check your connection and try again.");
                } else if (error.code === 'unavailable' || error.code === 'network-request-failed') {
                    setError("Network error. Please check your internet connection.");
                } else {
                    setError(error.message || "Failed to load order details. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [location.state]);

    // If there's an error, show error state with retry option
    if (error) {
        return (
            <div className="min-h-screen bg-[#FFFBF2] flex items-center justify-center px-4">
                <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-lg">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Order</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => navigate('/cart')}
                            className="px-6 py-2 bg-[#E6D5B8] text-gray-900 rounded-xl hover:bg-[#d4b87c] transition-colors"
                        >
                            Return to Cart
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFFBF2] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E6D5B8] border-t-transparent"></div>
            </div>
        );
    }

    // If no order data, redirect to menu
    if (!order) {
        navigate('/menu');
        return null;
    }

    const formatDate = (dateString) => {
        try {
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return new Date(dateString).toLocaleDateString('id-ID', options);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const handleDownloadPDF = async () => {
        if (!order) return;

        try {
            setDownloading(true);
            const receipt = receiptRef.current;
            if (!receipt) throw new Error('Receipt element not found');

            // Improve image quality with better scale
            const canvas = await html2canvas(receipt, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false
            });

            const imgWidth = 80; // mm
            const pageHeight = 297; // mm (A4)
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions to center the receipt
            const xOffset = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
            
            pdf.addImage(imgData, 'PNG', xOffset, 15, imgWidth, imgHeight);

            // Add page numbers if receipt is long
            let position = 0;
            while (heightLeft >= pageHeight) {
                position = heightLeft - pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', xOffset, -position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`AtasKota-Receipt-${order.orderNumber}.pdf`);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download receipt. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF2] pt-32 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Success Message */}
                <div className="bg-white rounded-xl p-8 mb-8 text-center shadow-lg">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-gray-600">Your order has been confirmed and is being processed.</p>
                </div>

                {/* Receipt Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                    <div ref={receiptRef} className="space-y-6 p-4">
                        {/* Header with Logo */}
                        <div className="text-center border-b-2 border-dashed border-gray-200 pb-6">
                            <img 
                                src="/src/assets/Photos/Logo.png" 
                                alt="Atas Kota Coffee" 
                                className="w-40 mx-auto mb-4"
                            />
                            <h2 className="font-sans font-[600] text-2xl text-gray-800 mb-1">Receipt Order</h2>
                            <p className="text-gray-500 text-sm">#{order.orderNumber}</p>
                        </div>

                        {/* Store Info */}
                        <div className="text-center text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-base">Atas Kota Coffee</p>
                            <p>Jl. Raya Kota No. 123</p>
                            <p>Tel: (021) 123-4567</p>
                        </div>

                        {/* Customer Details */}
                        <div className="grid grid-cols-2 gap-6 text-sm border-t border-b border-gray-200 py-6">
                            <div>
                                <p className="text-gray-500 mb-1">Customer</p>
                                <p className="font-medium">{order.customerName}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Table Number</p>
                                <p className="font-medium">{order.seatNumber}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Payment Method</p>
                                <p className="font-medium">{order.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Date</p>
                                <p className="font-medium">{formatDate(order.createdAt)}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-800 mb-2">Order Details</h3>
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-b-0">
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-gray-500">x{item.quantity} @Rp {item.price.toLocaleString()}</p>
                                    </div>
                                    <p className="font-medium">Rp {(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Total Amount</span>
                                <span className="text-xl font-bold">Rp {order.total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center space-y-2 text-sm text-gray-600 pt-6 border-t border-gray-200">
                            <p className="font-medium text-base">Thank you for your order!</p>
                            <p className="text-xs">Follow us @AtasKotaCoffee</p>
                            <p className="text-[10px] mt-2">This is a computer generated receipt</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={downloading}
                            className="px-6 py-2 bg-[#E6D5B8] text-gray-900 rounded-xl hover:bg-[#d4b87c] transition-colors flex items-center gap-2"
                        >
                            {downloading ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full"></div>
                                    <span>Downloading...</span>
                                </>
                            ) : (
                                <>
                                    <span>Download Receipt</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => navigate('/menu')}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
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