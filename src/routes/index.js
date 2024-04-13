//Config
import { routes } from '~/config';
//Layout
import { HeaderOnly, UserDashboard } from '~/layouts';
//Page
import Home from '~/pages/Home';
import BookDetails from '~/pages/BookDetails';
import Checkouts from '~/pages/Checkouts';
import SearchResults from '~/pages/SearchResults/SearchResults';
import Author from '~/pages/Author';
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
import Forbidden from '~/pages/Forbidden';

import OrdersDashboard from '~/pages/Admin/ManageOrders/OrdersDashboard';
import OrderForm from '~/pages/Admin/ManageOrders/OrderForm';

import ProductsDashboard from '~/pages/Admin/ManageProducts/ProductsDashboard';
import ProductForm from '~/pages/Admin/ManageProducts/ProductForm';

import BannersDashboard from '~/pages/Admin/ManageBanners/BannersDashboard';
import BannerForm from '~/pages/Admin/ManageBanners/BannerForm';

import CategoriesDashboard from '~/pages/Admin/ManageCategories/CategoriesDashboard';
import CategoryForm from '~/pages/Admin/ManageCategories/CategoryForm';

import UsersDashboard from '~/pages/Admin/ManageUsers/UsersDashboard';
import UserForm from '~/pages/Admin/ManageUsers/UserForm';
import AdminChat from '~/pages/Admin/AdminChat';
import Chattt from '~/pages/Admin/AdminChat/Chattt';

import AuthorsDashboard from '~/pages/Admin/ManageAuthors/AuthorsDashboard';
import AuthorForm from '~/pages/Admin/ManageAuthors/AuthorForm';
import AuthorDetail from '~/pages/Admin/ManageAuthors/AuthorDetail';

import BookSetsDashboard from '~/pages/Admin/ManageBookSets/BookSetsDashboard';
import BookSetForm from '~/pages/Admin/ManageBookSets/BookSetForm';
import BookSetDetail from '~/pages/Admin/ManageBookSets/BookSetDetail';
import OrderDetail from '~/pages/Admin/ManageOrders/OrderDetail';

const publicRoutes = [
    { path: routes.home, component: Home },
    { path: routes.bookDetails, component: BookDetails },
    { path: routes.searchResults, component: SearchResults },
    { path: routes.getProductByAuthor, component: Author },
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
    { path: routes.adminDashboard, component: Dashboard, layout: AdminLayout },

    { path: routes.viewUsers, component: UsersDashboard, layout: AdminLayout },
    { path: routes.createUser, component: UserForm, layout: AdminLayout },
    { path: routes.updateUser, component: UserForm, layout: AdminLayout },
    { path: routes.viewMessages, component: AdminChat, layout: AdminLayout },
    { path: routes.viewMessage, component: Chattt, layout: AdminLayout },

    { path: routes.viewProducts, component: ProductsDashboard, layout: AdminLayout },
    { path: routes.createProduct, component: ProductForm, layout: AdminLayout },
    { path: routes.updateProduct, component: ProductForm, layout: AdminLayout },

    { path: routes.viewOders, component: OrdersDashboard, layout: AdminLayout },
    { path: routes.viewOder, component: OrderDetail, layout: AdminLayout },
    { path: routes.updateOder, component: OrderForm, layout: AdminLayout },

    { path: routes.viewCategorys, component: CategoriesDashboard, layout: AdminLayout },
    { path: routes.createCategory, component: CategoryForm, layout: AdminLayout },
    { path: routes.updateCategory, component: CategoryForm, layout: AdminLayout },

    { path: routes.viewBanners, component: BannersDashboard, layout: AdminLayout },
    { path: routes.createBanner, component: BannerForm, layout: AdminLayout },
    { path: routes.updateBanner, component: BannerForm, layout: AdminLayout },

    { path: routes.viewAuthors, component: AuthorsDashboard, layout: AdminLayout },
    { path: routes.viewAuthor, component: AuthorDetail, layout: AdminLayout },
    { path: routes.createAuthor, component: AuthorForm, layout: AdminLayout },
    { path: routes.updateAuthor, component: AuthorForm, layout: AdminLayout },

    { path: routes.viewBookSets, component: BookSetsDashboard, layout: AdminLayout },
    { path: routes.viewBookSet, component: BookSetDetail, layout: AdminLayout },
    { path: routes.createBookSet, component: BookSetForm, layout: AdminLayout },
    { path: routes.updateBookSet, component: BookSetForm, layout: AdminLayout },
]

export { publicRoutes, privateRoutes, adminRoutes } 