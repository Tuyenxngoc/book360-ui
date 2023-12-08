//Config
import config from "~/config";
//Layout
import { HeaderOnly, UserDashboard } from "~/layouts";
//Page
import Home from "~/pages/Home";
import BookDetails from "~/pages/BookDetails";
import Checkouts from "~/pages/Checkouts";
import SearchResults from "~/pages/SearchResults/SearchResults";
import Category from "~/pages/Category";
import Cart from "~/pages/Cart";
import Login from "~/pages/Login";
import Profile from "~/pages/Profile/Profile";
import Register from "~/pages/Register";
import ForgotPassword from "~/pages/ForgotPassword";
import Purchase from "~/pages/Purchase";
import ChangePassword from "~/pages/ChangePassword";
import Notification from "~/pages/Notification";
import Address from "~/pages/Address";
import Favorite from "~/pages/Favorite";

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.bookDetails, component: BookDetails },
    { path: config.routes.searchResults, component: SearchResults },
    { path: config.routes.category, component: Category },
    { path: config.routes.login, component: Login, layout: HeaderOnly },
    { path: config.routes.register, component: Register, layout: HeaderOnly },
    { path: config.routes.forgotPassword, component: ForgotPassword, layout: HeaderOnly },
]

const privateRoutes = [
    { path: config.routes.cart, component: Cart },
    { path: config.routes.checkouts, component: Checkouts, layout: null },

    { path: config.routes.profile, component: Profile, layout: UserDashboard },
    { path: config.routes.password, component: ChangePassword, layout: UserDashboard },
    { path: config.routes.address, component: Address, layout: UserDashboard },
    { path: config.routes.notification, component: Notification, layout: UserDashboard },
    { path: config.routes.purchaseOrder, component: Purchase, layout: UserDashboard },
    { path: config.routes.favorite, component: Favorite, layout: UserDashboard },

]

export { publicRoutes, privateRoutes } 