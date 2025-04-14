import React, {createContext, useContext, useState, useEffect} from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({children}) => {
    const [showCart, setShowCart] =  useState(false);
    const [cartItems, setcartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState();
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

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
            });

            setcartItems(updatedCartItems);
        } else {
            product.quantity = quantity;
            setcartItems([...cartItems, {...product}])
        }
        toast.success(`${qty} ${product.name} added to the cart.`);
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
            setShowCart
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);