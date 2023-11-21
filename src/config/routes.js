const routes = {
    //Public routes
    home: '/',
    bookDetails: '/product/:id',
    category: '/category/:id',
    login: '/login',
    searchResults: '/search',
    //Private routes
    checkouts: '/checkouts',
    cart: '/cart',
    upload: '/upload',
    profile: '/profile',

    notFound: '*',
}
export default routes;