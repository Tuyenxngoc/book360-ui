import PropTypes from 'prop-types';

import { createContext, useState } from 'react';
import useAuth from '~/hooks/useAuth';
import { getTotalProducts } from '~/services/cartService';

const CartContext = createContext();

const CartProvider = ({ children }) => {

    const { isAuthenticated, customer } = useAuth();
    const [totalProducts, setTotalProducts] = useState(0);

    const updateTotalProducts = async () => {
        if (isAuthenticated) {
            try {
                const response = await getTotalProducts(customer.customerId);
                setTotalProducts(response.data.data.totalProducts);
            } catch (error) {
                console.error('Error updating total products:', error);
            }
        } else {
            setTotalProducts(0);
        }
    };

    const contextValues = {
        totalProducts,
        setTotalProducts,
        updateTotalProducts,
    };

    return (
        <CartContext.Provider value={contextValues}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node,
};

export { CartContext, CartProvider };
