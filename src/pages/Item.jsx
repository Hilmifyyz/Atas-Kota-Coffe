import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, where, addDoc, serverTimestamp, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaStar, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Item = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAdmin } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [ratings, setRatings] = useState([]);
    const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
    const [raterName, setRaterName] = useState('');
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [reviewComment, setReviewComment] = useState('');
    const [ratingError, setRatingError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeletingReview, setIsDeletingReview] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productDoc = await getDoc(doc(db, "products", id));
                if (productDoc.exists()) {
                    setProduct({ id: productDoc.id, ...productDoc.data() });
                    // Fetch ratings for this product
                    await fetchRatings(productDoc.id);
                } else {
                    console.error("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Fetch ratings from database
    const fetchRatings = async (productId) => {
        try {
            const ratingsQuery = query(
                collection(db, "ratings"),
                where("productId", "==", productId),
                orderBy("createdAt", "desc")
            );
            const ratingsSnapshot = await getDocs(ratingsQuery);
            const ratingsData = ratingsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRatings(ratingsData);

            // Calculate average rating
            if (ratingsData.length > 0) {
                const avgRating = ratingsData.reduce((acc, curr) => acc + curr.rating, 0) / ratingsData.length;
                setRating(Math.round(avgRating * 2) / 2); // Round to nearest 0.5
            }
        } catch (error) {
            console.error("Error fetching ratings:", error);
        }
    };

    // Submit rating with validation
    const submitRating = async () => {
        setRatingError('');
        setIsSubmitting(true);

        try {
            // Validation
            if (!raterName.trim()) {
                setRatingError('Please enter your name');
                return;
            }
            if (rating === 0) {
                setRatingError('Please select a rating');
                return;
            }
            if (!reviewComment.trim()) {
                setRatingError('Please enter a review comment');
                return;
            }

            const ratingData = {
                productId: id,
                rating: rating,
                raterName: raterName.trim(),
                comment: reviewComment.trim(),
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, "ratings"), ratingData);
            setIsRatingSubmitted(true);
            setShowRatingForm(false);
            await fetchRatings(id);
            alert('Thank you for your rating and review!');
            
            // Reset form
            setRaterName('');
            setReviewComment('');
            setRating(0);
        } catch (error) {
            console.error("Error submitting rating:", error);
            setRatingError('Failed to submit rating. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleIncrement = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const handleDecrement = () => {
        setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1);
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        setQuantity(value < 1 ? 1 : value);
    };

    const handleAddToCart = async () => {
        try {
            setAddingToCart(true);
            await addToCart(product, quantity);
            navigate('/cart');
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add item to cart. Please try again.");
        } finally {
            setAddingToCart(false);
        }
    };

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const ratingsRef = collection(db, 'ratings');
                const q = query(ratingsRef, where('productId', '==', id));
                const querySnapshot = await getDocs(q);
                const ratingsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRatings(ratingsData);
            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        };
        fetchRatings();
    }, [id]);

    const handleRatingChange = (value) => {
        setRating(value);
        setShowRatingForm(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if (!isAdmin || isDeletingReview) return;
        
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            setIsDeletingReview(true);
            await deleteDoc(doc(db, "ratings", reviewId));
            await fetchRatings(id);
        } catch (error) {
            console.error("Error deleting review:", error);
            alert("Failed to delete review. Please try again.");
        } finally {
            setIsDeletingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2] flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2] flex items-center justify-center">
                Product not found
            </div>
        );
    }

    return (
        <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2]">
            {/* Rating Form Modal */}
            <AnimatePresence>
                {showRatingForm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowRatingForm(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowRatingForm(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-800">Rate This Product</h2>
                                <p className="text-gray-600 mt-2">Share your experience with others</p>
                            </div>

                            {ratingError && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start"
                                >
                                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {ratingError}
                                </motion.div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        value={raterName}
                                        onChange={(e) => setRaterName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#b69d74] focus:ring focus:ring-[#b69d74] focus:ring-opacity-30 transition-all duration-200"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-semibold mb-4">
                                        Your Rating
                                    </label>
                                    <div className="flex justify-center gap-3">
                                        {[1, 2, 3, 4, 5].map((index) => (
                                            <motion.button
                                                key={index}
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRatingChange(index)}
                                                onMouseEnter={() => setHover(index)}
                                                onMouseLeave={() => setHover(0)}
                                                className="relative group"
                                            >
                                                <FaStar
                                                    className={`w-12 h-12 transition-all duration-200 ${
                                                        index <= (hover || rating)
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                    } ${index <= hover ? 'drop-shadow-lg' : ''}`}
                                                />
                                                <motion.span
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ 
                                                        opacity: hover === index ? 1 : 0,
                                                        y: hover === index ? 0 : 10
                                                    }}
                                                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600 whitespace-nowrap"
                                                >
                                                    {index === 1 ? 'Poor' : 
                                                     index === 2 ? 'Fair' : 
                                                     index === 3 ? 'Good' : 
                                                     index === 4 ? 'Very Good' : 'Excellent'}
                                                </motion.span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                                        Your Review
                                    </label>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#b69d74] focus:ring focus:ring-[#b69d74] focus:ring-opacity-30 transition-all duration-200 min-h-[120px] resize-none"
                                        placeholder="What did you like or dislike about this product?"
                                        rows={4}
                                        required
                                    />
                                </div>

                                <button
                                    onClick={submitRating}
                                    disabled={isSubmitting}
                                    className="w-full mt-6 px-6 py-4 bg-[#b69d74] text-white rounded-xl font-semibold hover:bg-[#ad8e5b] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </div>
                                    ) : 'Submit Review'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto p-4 md:p-8 pt-24 md:pt-32 flex flex-col md:flex-row md:gap-8">
                {/* Image gallery */}
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                    {/* Main Image */}
                    <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4">
                        <div 
                            className="w-full h-full bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${product.imageUrl})` }}
                        />
                    </div>
                </div>

                {/* Product details */}   
                <div className="w-full md:w-1/2">
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.title}</h1>
                    <p className="text-gray-600 mb-6">
                        {product.description}
                    </p>

                    <div className="bg-[#fdf6e9] p-4 md:p-6 rounded-lg mb-6">
                        <span className="text-2xl md:text-3xl font-bold">
                            Rp. {product.price.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex items-center">
                            <span className="text-lg md:text-xl font-semibold mr-2">{rating.toFixed(1)}</span>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <FaStar
                                        key={index}
                                        className={`w-6 h-6 ${
                                            index <= rating
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-500 ml-2 text-sm md:text-base">
                                {ratings.length} {ratings.length === 1 ? 'Rating' : 'Ratings'}
                            </span>
                        </div>
                        {!isRatingSubmitted && (
                            <button
                                onClick={() => setShowRatingForm(true)}
                                className="text-[#b69d74] hover:text-[#8c7654] text-sm font-medium"
                            >
                                Rate this product
                            </button>
                        )}
                        {isRatingSubmitted && (
                            <p className="text-sm text-green-600">
                                Thank you for rating this product!
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-gray-700">Jumlah</span>
                        <div className="flex items-center border rounded-md">
                            <button 
                                className="px-3 md:px-4 py-2 text-xl"
                                onClick={handleDecrement}
                            >
                                -
                            </button>
                            <input 
                                type="text" 
                                value={quantity} 
                                onChange={handleInputChange}
                                className="w-12 md:w-16 text-center border-x py-2 bg-[#FFFBF2]" 
                            />
                            <button 
                                className="px-3 md:px-4 py-2 text-xl"
                                onClick={handleIncrement}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="flex-1 px-4 md:px-6 py-3 border-2 hover:bg-[#ccb796] hover:text-white hover:border-[#ccb796] border-[#b69d74] text-[#b69d74] rounded-lg font-semibold text-sm md:text-base"
                        >
                            {addingToCart ? 'Adding...' : 'Add to cart'}
                        </button>
                        <button className="flex-1 px-4 md:px-6 py-3 hover:bg-[#ad8e5b] bg-[#b69d74] text-white rounded-lg font-semibold text-sm md:text-base">
                            Buy
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="max-w-6xl mx-auto p-4 md:p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
                        <p className="text-gray-600 mt-1">
                            {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>
                    {!isRatingSubmitted && (
                        <button
                            onClick={() => setShowRatingForm(true)}
                            className="px-6 py-3 bg-[#b69d74] text-white rounded-xl font-semibold hover:bg-[#ad8e5b] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Write a Review
                        </button>
                    )}
                </div>
                
                {ratings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <p className="text-gray-600 mb-4">No reviews yet</p>
                        <button
                            onClick={() => setShowRatingForm(true)}
                            className="px-6 py-3 bg-[#b69d74] text-white rounded-xl font-semibold hover:bg-[#ad8e5b] transition-all duration-200"
                        >
                            Be the first to review
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {ratings.map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 relative"
                            >
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        disabled={isDeletingReview}
                                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                                        title="Delete review"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">{review.raterName}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FaStar
                                                        key={star}
                                                        className={`w-4 h-4 ${
                                                            star <= review.rating
                                                                ? 'text-yellow-400'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {review.createdAt?.toDate().toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700 leading-relaxed pr-8">{review.comment}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Item;