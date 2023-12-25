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
    admin: '/admin',
    manageUsers: '/admin/users',
    //Manage products routes
    viewListProduct: '/admin/products',
    createProduct: '/admin/product/create',
    updateProduct: '/admin/product/:productId',
    //Manage orders routes
    manageOder: '/admin/orders',
    manageCategories: '/admin/categories',

    viewBanners: '/admin/banner',
    createBanner: '/admin/banner/create',
    updateBanner: '/admin/banner/:bannerId',

    accessDenied: '/access-denied',
    notFound: '*',
}
export default routes;