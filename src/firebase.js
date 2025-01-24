// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, query, orderBy, deleteDoc, updateDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9sYkHoUm9HiBmw_gQPZ5LKXXXmLvrVfg",
  authDomain: "ataskota.firebaseapp.com",
  projectId: "ataskota",
  storageBucket: "ataskota.appspot.com",
  messagingSenderId: "345652813951",
  appId: "1:345652813951:web:f60124bed7d7ce23955f4a",
  measurementId: "G-MXRZPX5GCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Function to check if user is admin
export const checkAdminStatus = async (uid) => {
  if (!uid) return false;
  const userDoc = await getDoc(doc(db, 'admins', uid));
  return userDoc.exists() && userDoc.data().admin === true;
};

// Product Management Functions
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      title: productData.title,
      price: parseFloat(productData.price),
      category: productData.category,
      description: productData.description,
      imageUrl: productData.imageUrl,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Error adding product: " + error.message);
  }
};

export const getProducts = async () => {
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products: " + error.message);
  }
};

export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Error deleting product: " + error.message);
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      title: productData.title,
      price: parseFloat(productData.price),
      category: productData.category,
      description: productData.description,
      imageUrl: productData.imageUrl,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Error updating product: " + error.message);
  }
};