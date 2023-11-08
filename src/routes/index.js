//Layout
import { HeaderOnly } from "~/Components/Layout";
//Page
import Home from "~/pages/Home";
import BookDetails from "~/pages/BookDetails";
import UpLoad from "~/pages/Upload";
import Checkouts from "~/pages/Checkouts";

//Public routes
/*
layout = null=> khong co layout
khong co layout=> default layout
*/
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/books', component: BookDetails },
    { path: '/upload', component: UpLoad, layout: HeaderOnly },
    { path: '/checkouts', component: Checkouts, layout: null },
]

const privateRoutes = []

export { privateRoutes, publicRoutes } 