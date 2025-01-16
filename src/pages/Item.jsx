import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, where, arrayUnion, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaStar } from "react-icons/fa";

const Item = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [ratings, setRatings] = useState([]);
    const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

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
                where("productId", "==", productId)
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
                setRating(avgRating);
            }

            // Check if user has already rated
            if (user) {
                const userRatingData = ratingsData.find(r => r.userId === user.uid);
                if (userRatingData) {
                    setUserRating(userRatingData.rating);
                    setIsRatingSubmitted(true);
                }
            }
        } catch (error) {
            console.error("Error fetching ratings:", error);
        }
    };

    // Submit rating
    const submitRating = async (value) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const ratingData = {
                userId: user.uid,
                productId: id,
                rating: value,
                createdAt: serverTimestamp()
            };

            // Check if user has already rated
            const existingRatingQuery = query(
                collection(db, "ratings"),
                where("userId", "==", user.uid),
                where("productId", "==", id)
            );
            const existingRatingSnapshot = await getDocs(existingRatingQuery);

            if (!existingRatingSnapshot.empty) {
                // Update existing rating
                const existingRatingDoc = existingRatingSnapshot.docs[0];
                await updateDoc(doc(db, "ratings", existingRatingDoc.id), {
                    rating: value,
                    updatedAt: serverTimestamp()
                });
            } else {
                // Add new rating
                await addDoc(collection(db, "ratings"), ratingData);
            }

            // Update product's rating in products collection
            const productRef = doc(db, "products", id);
            await updateDoc(productRef, {
                totalRatings: arrayUnion(value)
            });

            setUserRating(value);
            setIsRatingSubmitted(true);
            await fetchRatings(id);
        } catch (error) {
            console.error("Error submitting rating:", error);
            alert("Failed to submit rating. Please try again.");
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
                                    <button
                                        key={index}
                                        className={`cursor-pointer ${isRatingSubmitted && 'cursor-not-allowed'}`}
                                        onClick={() => !isRatingSubmitted && submitRating(index)}
                                        onMouseEnter={() => !isRatingSubmitted && setHover(index)}
                                        onMouseLeave={() => !isRatingSubmitted && setHover(0)}
                                        disabled={isRatingSubmitted}
                                    >
                                        <FaStar
                                            className={`w-6 h-6 ${
                                                index <= (hover || userRating || rating)
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-gray-500 ml-2 text-sm md:text-base">
                                {ratings.length} {ratings.length === 1 ? 'Rating' : 'Ratings'}
                            </span>
                        </div>
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
        </div>
    );
};

export default Item;