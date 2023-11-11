//Config
import config from "~/config";
//Layout
import HeaderOnly from "~/layouts/HeaderOnly";
//Page
import Home from "~/pages/Home";
import BookDetails from "~/pages/BookDetails";
import UpLoad from "~/pages/Upload";
import Checkouts from "~/pages/Checkouts";
import NotFound from "~/pages/NotFound";

//Public routes
/*
layout = null=> khong co layout
khong co layout=> default layout
*/
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.bookDetails, component: BookDetails },
    { path: config.routes.upload, component: UpLoad, layout: HeaderOnly },
    { path: config.routes.checkouts, component: Checkouts, layout: null },
    { path: config.routes.notFound, component: NotFound },
]

const privateRoutes = []

export { privateRoutes, publicRoutes } 