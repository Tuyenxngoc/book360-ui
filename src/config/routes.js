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
    adminDashboard: '/admin',

    //Manage user routes
    viewUser: '/admin/user',
    createUser: '/admin/user/create',
    updateUser: '/admin/user/:userId',

    //Manage products routes
    viewProduct: '/admin/product',
    createProduct: '/admin/product/create',
    updateProduct: '/admin/product/:productId',

    //Manage orders routes
    viewOder: '/admin/order',

    //Manage categories routes
    viewCategory: '/admin/category',
    createCategory: '/admin/category/create',
    updateCategory: '/admin/category/:categoryId',

    //Manage banners routes
    viewBanner: '/admin/banner',
    createBanner: '/admin/banner/create',
    updateBanner: '/admin/banner/:bannerId',

    accessDenied: '/access-denied',
    notFound: '*',
}
export default routes;