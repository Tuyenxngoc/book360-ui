const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const LAST_VIEW_PRODUCTS = 'last_view_products';

const getItem = (key) => {
    return localStorage.getItem(key);
};

const setItem = (key, value) => {
    localStorage.setItem(key, value);
};

const removeItem = (key) => {
    localStorage.removeItem(key);
};

const localStorageKeys = { ACCESS_TOKEN, REFRESH_TOKEN, LAST_VIEW_PRODUCTS };
export default localStorageKeys;
export { getItem, setItem, removeItem };
