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
    upload: '/upload',
    profile: '/profile',
    purchaseOrder: '/purchase',
    //Notfound routes
    notFound: '*',
}
export default routes;