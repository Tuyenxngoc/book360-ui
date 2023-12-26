//Config
import { routes } from '~/config';
//Layout
import { HeaderOnly, UserDashboard } from '~/layouts';
//Page
import Home from '~/pages/Home';
import BookDetails from '~/pages/BookDetails';
import Checkouts from '~/pages/Checkouts';
import SearchResults from '~/pages/SearchResults/SearchResults';
import Category from '~/pages/Category';
import Cart from '~/pages/Cart';
import Login from '~/pages/Login';
import Profile from '~/pages/Profile/Profile';
import Register from '~/pages/Register';
import ForgotPassword from '~/pages/ForgotPassword';
import Purchase from '~/pages/Purchase';
import ChangePassword from '~/pages/ChangePassword';
import Notification from '~/pages/Notification';
import Address from '~/pages/Address';
import Favorite from '~/pages/Favorite';
import NotFound from '~/pages/NotFound';
import AdminLayout from '~/layouts/AdminLayout';
import Dashboard from '~/pages/Admin/Dashboard';
import ManageUsers from '~/pages/Admin/ManageUsers';
import ManageProducts from '~/pages/Admin/ManageProducts';
import ManageOrders from '~/pages/Admin/ManageOrders';
import ManageCategories from '~/pages/Admin/ManageCategories';
import Forbidden from '~/pages/Forbidden';
import ManageBanner from '~/pages/Admin/ManageBanners';
import BannerForm from '~/pages/Admin/ManageBanners/BannerForm';
import ProductForm from '~/pages/Admin/ManageProducts/ProductForm';

const publicRoutes = [
    { path: routes.home, component: Home },
    { path: routes.bookDetails, component: BookDetails },
    { path: routes.searchResults, component: SearchResults },
    { path: routes.category, component: Category },
    { path: routes.login, component: Login, layout: HeaderOnly },
    { path: routes.register, component: Register, layout: HeaderOnly },
    { path: routes.forgotPassword, component: ForgotPassword, layout: HeaderOnly },

    { path: routes.notFound, component: NotFound, layout: HeaderOnly },
    { path: routes.accessDenied, component: Forbidden, layout: HeaderOnly },
]

const privateRoutes = [
    { path: routes.cart, component: Cart },
    { path: routes.checkouts, component: Checkouts, layout: null },

    { path: routes.profile, component: Profile, layout: UserDashboard },
    { path: routes.password, component: ChangePassword, layout: UserDashboard },
    { path: routes.address, component: Address, layout: UserDashboard },
    { path: routes.notification, component: Notification, layout: UserDashboard },
    { path: routes.purchaseOrder, component: Purchase, layout: UserDashboard },
    { path: routes.favorite, component: Favorite, layout: UserDashboard },

]

const adminRoutes = [
    { path: routes.admin, component: Dashboard, layout: AdminLayout },
    { path: routes.manageUsers, component: ManageUsers, layout: AdminLayout },

    { path: routes.viewListProduct, component: ManageProducts, layout: AdminLayout },
    { path: routes.createProduct, component: ProductForm, layout: AdminLayout },
    { path: routes.updateProduct, component: ProductForm, layout: AdminLayout },

    { path: routes.manageOder, component: ManageOrders, layout: AdminLayout },
    { path: routes.manageCategories, component: ManageCategories, layout: AdminLayout },

    { path: routes.viewBanners, component: ManageBanner, layout: AdminLayout },
    { path: routes.createBanner, component: BannerForm, layout: AdminLayout },
    { path: routes.updateBanner, component: BannerForm, layout: AdminLayout },

]

export { publicRoutes, privateRoutes, adminRoutes } 