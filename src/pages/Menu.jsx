import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProducts } from "../firebase";
import { useCart } from "../context/CartContext";

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsData = await getProducts();
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products based on search and category
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddToCart = async (e, product) => {
        e.preventDefault(); // Prevent navigation to product details
        
        try {
            await addToCart(product);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add item to cart. Please try again.");
        }
    };

    return (
        <div className="w-screen min-h-screen absolute top-0 left-0 right-0 bg-[#FFFBF2]">
            {/* Success Toast */}
            {showToast && (
                <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300">
                    Item added to cart!
                </div>
            )}

            <div className="flex pt-20">
                {/* Left Side - Navigation */}
                <div className="w-[280px] min-h-screen bg-white ml-10 mt-6 rounded-xl fixed p-6 shadow-lg">
                    {/* Logo */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">ATAS KOTA</h1>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h2 className="font-semibold mb-4">Categories</h2>
                        
                        {/* Search Bar */}
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Cari Produk"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            <span className="absolute right-3 w-5 h-5 bg-SearchIcon bg-cover top-2.5"></span>
                        </div>

                        {/* Dropdown Menus */}
                        <div className="space-y-2">
                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded"
                                        onClick={() => setSelectedCategory('hot-coffee')}>
                                    <span className="w-5 h-5 mr-2 bg-CoffeeIcon bg-cover bg-center"></span>
                                    Coffee
                                </summary>
                                <div className="pl-9 py-2 text-left space-y-2">
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Latte</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Arabica</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Espresso</p>
                                    </Link>
                                </div>
                            </details>
                            
                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded"
                                        onClick={() => setSelectedCategory('cake')}>
                                    <span className="w-5 h-5 mr-2 bg-CakeIcon bg-cover bg-center"></span>
                                    Cake
                                </summary>
                                <div className="pl-10 py-2 text-left space-y-2">
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Latte</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Arabica</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Espresso</p>
                                    </Link>
                                </div>
                            </details>

                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded"
                                        onClick={() => setSelectedCategory('food')}>
                                    <span className="w-5 h-5 mr-2 bg-FoodIcon bg-cover bg-center"></span>
                                    Food
                                </summary>
                                <div className="pl-10 py-2 text-left space-y-2">
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Latte</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Arabica</p>
                                    </Link>
                                    <Link to="/menu/">
                                    <p className="hover:bg-gray-100 p-1">Espresso</p>
                                    </Link>
                                </div>
                            </details>

                            <details className="cursor-pointer">
                                <summary className="flex items-center p-2 bg-gray-100 hover:bg-gray-300 rounded"
                                        onClick={() => setSelectedCategory('drinks')}>
                                    <span className="w-5 h-5 mr-2 bg-DrinkIcon bg-cover bg-center"></span>
                                    Drinks
                                </summary>
                                <div className="pl-10 py-2 text-left space-y-2">
                                    <Link to="/menu/item">
                                    <p className="hover:bg-gray-100 p-1">Latte</p>
                                    </Link>
                                    <Link to="/menu/item">
                                    <p className="hover:bg-gray-100 p-1">Arabica</p>
                                    </Link>
                                    <Link to="/menu/item">
                                    <p className="hover:bg-gray-100 p-1">Espresso</p>
                                    </Link>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>

                {/* Right Side - Menu Items */}
                <div className="flex-1 p-8 ml-[320px]">
                    {/* Menu Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-2">Menu Kami</h2>
                        <p className="text-gray-600">Nikmati berbagai menu kami yang banyak variannya</p>
                    </div>

                    {/* Menu Grid */}
                    <div className="flex flex-wrap gap-4">
                        {loading ? (
                            <p>Loading...</p>
                        ) : filteredProducts.length === 0 ? (
                            <p>No products found.</p>
                        ) : (
                            filteredProducts.map((product) => (
                                <Link to={`/menu/item/${product.id}`} key={product.id}>
                                    <div className="w-[230px] bg-white rounded-2xl shadow-md relative overflow-hidden">
                                        <div className="relative">
                                            <div 
                                                className="h-[300px] w-full bg-cover bg-center" 
                                                style={{ backgroundImage: `url(${product.imageUrl})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            
                                            <div className="absolute bottom-0 text-left left-0 p-4 text-white">
                                                <h3 className="font-semibold text-xl">{product.title}</h3>
                                                <p className="pl-1 text-white">Rp {product.price.toLocaleString()}</p>
                                            </div>

                                            <button 
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="absolute bottom-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                                            >
                                                <span className="text-xl pb-1">+</span>
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;