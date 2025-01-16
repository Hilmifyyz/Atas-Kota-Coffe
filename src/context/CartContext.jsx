import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types';

const CartContext = createContext();
const LOCAL_STORAGE_KEY = 'ataskota_cart';

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load cart items from local storage or Firestore depending on auth status
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                if (user) {
                    // Fetch from Firestore for authenticated users
                    const q = query(collection(db, "cart"), where("userId", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const items = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setCartItems(items);
                } else {
                    // Load from localStorage for non-authenticated users
                    const localCart = localStorage.getItem(LOCAL_STORAGE_KEY);
                    if (localCart) {
                        setCartItems(JSON.parse(localCart));
                    } else {
                        setCartItems([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching cart items:", error);
                // If there's an error, fallback to local storage
                const localCart = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (localCart) {
                    setCartItems(JSON.parse(localCart));
                } else {
                    setCartItems([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [user]);

    // Save cart items to localStorage when they change (for non-authenticated users)
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
        }
    }, [cartItems, loading]);

    const addToCart = async (product, quantity = 1) => {
        try {
            if (user) {
                // Add to Firestore for authenticated users
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
            } else {
                // Add to local storage for non-authenticated users
                setCartItems(prevItems => {
                    const existingItem = prevItems.find(item => item.productId === product.id);
                    if (existingItem) {
                        return prevItems.map(item =>
                            item.productId === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        );
                    } else {
                        const newItem = {
                            id: Date.now().toString(), // Generate a temporary ID
                            productId: product.id,
                            title: product.title,
                            price: product.price,
                            imageUrl: product.imageUrl,
                            quantity: quantity,
                            category: product.category,
                            description: product.description
                        };
                        return [...prevItems, newItem];
                    }
                });
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            // If Firestore fails, fallback to local storage
            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => item.productId === product.id);
                if (existingItem) {
                    return prevItems.map(item =>
                        item.productId === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    const newItem = {
                        id: Date.now().toString(),
                        productId: product.id,
                        title: product.title,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        quantity: quantity,
                        category: product.category,
                        description: product.description
                    };
                    return [...prevItems, newItem];
                }
            });
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            if (user) {
                // Remove from Firestore for authenticated users
                await deleteDoc(doc(db, "cart", itemId));
            }
            // Remove from state (works for both authenticated and non-authenticated users)
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Error removing from cart:", error);
            // If Firestore fails, still remove from local state
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            if (user) {
                // Update in Firestore for authenticated users
                await updateDoc(doc(db, "cart", itemId), {
                    quantity: newQuantity
                });
            }
            // Update in state (works for both authenticated and non-authenticated users)
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        } catch (error) {
            console.error("Error updating quantity:", error);
            // If Firestore fails, still update local state
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
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