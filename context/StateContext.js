import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { client } from "../lib/client";
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext'; // Import the auth context

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setcartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    
    const router = useRouter();
    const { currentUser } = useAuth(); // Get the current user from auth context
    
    let foundProduct;

    // Fetch all categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            const query = `*[_type == "product"].category`;
            const fetchedCategories = await client.fetch(query);
            // Remove duplicates and nulls
            const uniqueCategories = [...new Set(fetchedCategories.filter(category => category))];
            setCategories(uniqueCategories);
        };

        const fetchAllProducts = async () => {
            const query = '*[_type == "product"]';
            const products = await client.fetch(query);
            setAllProducts(products);
            setFilteredProducts(products);
        };

        fetchCategories();
        fetchAllProducts();
    }, []);

    // Filter products when search term or category changes
    useEffect(() => {
        if (!allProducts.length) return;
        
        setLoading(true);
        
        let filtered = [...allProducts];
        
        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(product => 
                product.category === selectedCategory
            );
        }
        
        setFilteredProducts(filtered);
        setLoading(false);
    }, [searchTerm, selectedCategory, allProducts]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if(checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) 
                    return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                    }
                return cartProduct;
            });

            setcartItems(updatedCartItems);
        } else {
            product.quantity = quantity;
            setcartItems([...cartItems, {...product}])
        }
        toast.success(`${qty} ${product.name} added to the cart.`);
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
        setcartItems(newCartItems);
    }

    const toggleCartItemQuanitity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        
        if(value === 'increment') {
            const updatedData = cartItems.map(item => (item._id === id ? { ...item, quantity: item.quantity + 1 } : item));
            setcartItems(updatedData);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
        } else if(value === 'decrement') {
            if(foundProduct.quantity > 1) {
                const updatedData = cartItems.map(item => (item._id === id ? { ...item, quantity: item.quantity - 1 } : item));
                setcartItems(updatedData);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
            }
        }
    }

    const increaseQty = () => {
        setQty((prevQty) => prevQty + 1);
    }

    const decreaseQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1;
            return prevQty - 1;
        });
    }

    // Initialize Razorpay checkout
    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    // Create Razorpay order
    const createOrder = async (items, totalAmount) => {
        try {
            // Add user ID to the order if available
            const userId = currentUser ? currentUser.uid : null;
            
            const response = await fetch('/api/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    receipt: 'order_receipt_' + Math.random().toString(36).substring(2, 15),
                    notes: {
                        items: items.map(item => `${item.name} x ${item.quantity}`).join(', '),
                        userId: userId // Include the user ID in order notes
                    }
                }),
            });

            const data = await response.json();
            return data.order;
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Unable to create order. Please try again.');
            return null;
        }
    };

    // Handle payment success
    const handlePaymentSuccess = async (response) => {
        try {
            // Add user ID to the verification if available
            const userId = currentUser ? currentUser.uid : null;
            
            const result = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...response,
                    userId // Include the user ID in verification
                }),
            });
            
            const data = await result.json();
            
            if (data.status === 'success') {
                toast.success('Payment successful!');
                // Clear cart after successful payment
                setcartItems([]);
                setTotalPrice(0);
                setTotalQuantities(0);
                setShowCart(false);
                // Redirect to success page or home
                router.push('/success');
            } else {
                toast.error('Payment verification failed. Please contact support.');
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Something went wrong with payment verification.');
        } finally {
            setPaymentLoading(false);
        }
    };

    // Make payment - with authentication check
    const makePayment = async (items = cartItems, amount = totalPrice) => {
        // Check if user is authenticated
        if (!currentUser) {
            // Save current cart state in session storage before redirecting
            sessionStorage.setItem('pendingPurchase', JSON.stringify({
                items: items,
                amount: amount
            }));
            
            toast.error('Please login to complete your purchase');
            router.push('/login');
            return;
        }
        
        setPaymentLoading(true);
        
        try {
            // 1. Load Razorpay script
            const res = await initializeRazorpay();
            
            if (!res) {
                toast.error('Razorpay SDK failed to load');
                setPaymentLoading(false);
                return;
            }
            
            // 2. Create order
            const order = await createOrder(items, amount);
            
            if (!order) {
                setPaymentLoading(false);
                return;
            }
            
            // 3. Open Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Miniature Cars',
                description: 'Thank you for your purchase!',
                order_id: order.id,
                handler: handlePaymentSuccess,
                prefill: {
                    name: currentUser.displayName || '',
                    email: currentUser.email || '',
                    contact: ''
                },
                notes: {
                    address: 'Miniature Cars Corporate Office',
                    userId: currentUser.uid // Include user ID in payment notes
                },
                theme: {
                    color: '#f02d34'
                }
            };
            
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Something went wrong. Please try again later.');
            setPaymentLoading(false);
        }
    };

    // Buy Now function - handles direct purchase from product page
    const handleBuyNow = (product) => {
        const buyNowItem = { ...product, quantity: qty };
        makePayment([buyNowItem], product.price * qty);
    };

    return (
        <Context.Provider value={{
            showCart,
            cartItems,
            totalPrice,
            totalQuantities,
            qty,
            increaseQty,
            decreaseQty,
            onAdd,
            setShowCart,
            toggleCartItemQuanitity,
            onRemove,
            searchTerm,
            selectedCategory,
            categories,
            handleSearch,
            handleCategoryChange,
            filteredProducts,
            loading,
            makePayment,
            handleBuyNow,
            paymentLoading,
            setcartItems,
            setTotalPrice,
            setTotalQuantities
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);