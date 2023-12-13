const routes = {
    //Public routes
    home: '/',
    bookDetails: '/product/:id',
    category: '/category/:id',
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    searchResults: '/search',
    //Private routes
    checkouts: '/checkouts',
    cart: '/cart',
    profile: '/profile',
    password: '/password',
    address: '/address',
    notification: '/notification',
    purchaseOrder: '/purchase',
    favorite: '/favorite',

    // Admin routes
    admin: "/admin",
    manageUsers: "/admin/users",
    manageProduct: "/admin/products",
    manageOder: "/admin/orders",
    manageCategories: "/admin/categories",
    manageBanners: "/admin/banners",

    accessDenied: '/access-denied',
    notFound: '*',
}
export default routes;