import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch cart items from Firestore
    useEffect(() => {
        const fetchCartItems = async () => {
            if (!user) {
                setCartItems([]);
                setLoading(false);
                return;
            }

            try {
                const q = query(collection(db, "cart"), where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const items = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCartItems(items);
            } catch (error) {
                console.error("Error fetching cart items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [user]);

    const addToCart = async (product, quantity = 1) => {
        if (!user) {
            alert("Please login to add items to cart");
            return;
        }

        try {
            // Check if product already exists in cart
            const q = query(
                collection(db, "cart"), 
                where("userId", "==", user.uid),
                where("productId", "==", product.id)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Update quantity if product exists
                const cartItem = querySnapshot.docs[0];
                const currentQuantity = cartItem.data().quantity;
                const newQuantity = currentQuantity + quantity;
                
                await updateDoc(doc(db, "cart", cartItem.id), {
                    quantity: newQuantity
                });

                setCartItems(prevItems =>
                    prevItems.map(item =>
                        item.id === cartItem.id
                            ? { ...item, quantity: newQuantity }
                            : item
                    )
                );
            } else {
                // Add new product to cart
                const cartData = {
                    userId: user.uid,
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: quantity,
                    category: product.category,
                    description: product.description
                };

                const docRef = await addDoc(collection(db, "cart"), cartData);
                setCartItems(prevItems => [...prevItems, { id: docRef.id, ...cartData }]);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add item to cart. Please try again.");
        }
    };

    const removeFromCart = async (itemId) => {
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        try {
            // First verify that the item belongs to the current user
            const cartRef = doc(db, "cart", itemId);
            const cartDoc = await getDoc(cartRef);
            
            if (!cartDoc.exists()) {
                throw new Error("Cart item not found");
            }
            
            if (cartDoc.data().userId !== user.uid) {
                throw new Error("Unauthorized to delete this cart item");
            }

            await deleteDoc(cartRef);
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Error removing from cart:", error);
            throw error;
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (!user || newQuantity < 1) return;

        try {
            await updateDoc(doc(db, "cart", itemId), {
                quantity: newQuantity
            });
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
            alert("Failed to update quantity. Please try again.");
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired
}; 