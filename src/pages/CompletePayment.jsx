import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CompletePayment = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const receiptRef = useRef();

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

    const handleDownloadPDF = async () => {
        try {
            setDownloading(true);
            const receipt = receiptRef.current;

            // Improve image quality with better scale
            const canvas = await html2canvas(receipt, {
                scale: 2, // Increase quality
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFFBF2] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E6D5B8]"></div>
            </div>
        );
    }

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
                            {order.items.map((item, index) => (
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