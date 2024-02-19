const routes = {
    //Public routes
    home: '/',
    bookDetails: '/product/:id',
    category: '/category/:id',
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    searchResults: '/search',
    getProductByAuthor: '/author/:authorId',
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
    viewUsers: '/admin/user',
    createUser: '/admin/user/create',
    updateUser: '/admin/user/:userId',

    //Manage products routes
    viewProducts: '/admin/product',
    createProduct: '/admin/product/create',
    updateProduct: '/admin/product/:productId',

    //Manage orders routes
    viewOders: '/admin/order',
    viewOder: '/admin/order/:orderId',
    updateOder: '/admin/order/:orderId',

    //Manage categories routes
    viewCategorys: '/admin/category',
    createCategory: '/admin/category/create',
    updateCategory: '/admin/category/:categoryId',

    //Manage banners routes
    viewBanners: '/admin/banner',
    createBanner: '/admin/banner/create',
    updateBanner: '/admin/banner/:bannerId',

    //Manage author routes
    viewAuthors: '/admin/author',
    viewAuthor: '/admin/author/:authorId',
    createAuthor: '/admin/author/create',
    updateAuthor: '/admin/author/update/:authorId',

    //Manage bookset routes
    viewBookSets: '/admin/book-set',
    viewBookSet: '/admin/book-set/:bookSetId',
    createBookSet: '/admin/book-set/create',
    updateBookSet: '/admin/book-set/update/:bookSetId',

    accessDenied: '/access-denied',
    notFound: '*',
}
export default routes;