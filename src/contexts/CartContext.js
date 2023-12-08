import { createContext, useState } from 'react';
import { getTotalProducts } from '~/services/cartService';

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [totalProducts, setTotalProducts] = useState(0);

    const updateTotalProducts = async (customerId) => {
        try {
            const response = await getTotalProducts(customerId);
            setTotalProducts(response.data.data.totalProducts);
        } catch (error) {
            console.error("Error updating total products:", error);
        }
    };

    const contextValues = {
        totalProducts,
        updateTotalProducts,
    };

    return (
        <CartContext.Provider value={contextValues}>
            {children}
        </CartContext.Provider>
    );
};


export { CartContext, CartProvider };
