import { Menu } from 'antd';
import {
    BoldOutlined,
    DollarOutlined,
    HomeOutlined,
    OrderedListOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import images from '~/assets';

import classNames from 'classnames/bind';
import styles from './AdminSideBar.module.scss';
import useAuth from '~/hooks/useAuth';
import { routes } from '~/config';

const cx = classNames.bind(styles);
function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const items = [
    getItem('Trang chủ', routes.adminDashboard, <HomeOutlined />),
    getItem('Quản lý khách hàng', 'user', <UserOutlined />, [
        getItem('Tất cả khách hàng', routes.viewUsers),
        getItem('Thêm khách hàng', routes.createUser),
        getItem('Tin nhắn', routes.viewMessages),
    ]),
    getItem('Quản lý sản phẩm', 'product', <DollarOutlined />, [
        getItem('Tất cả sản phẩm', routes.viewProducts),
        getItem('Thêm sản phẩm', routes.createProduct),
    ]),
    getItem('Quản lý đơn hàng', 'order', <ShoppingCartOutlined />, [
        getItem('Tất cả', routes.viewOders),
        getItem('Đơn hủy', `${routes.viewOders}?type=CANCELLED`),
    ]),
    getItem('Quản lý banner', routes.viewBanners, <BoldOutlined />),
    getItem('Quản lý danh mục', routes.viewCategorys, <OrderedListOutlined />),
    getItem('Quản lý tác giả', routes.viewAuthors, <OrderedListOutlined />),
    getItem('Quản lý bộ sách', routes.viewBookSets, <OrderedListOutlined />),
];

function AdminSideBar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuItemClick = ({ key }) => {
        if (key === 'signout') {
            logout();
            navigate('/');
        } else {
            navigate(key);
        }
    };

    return (
        <>
            <div className={cx('logo')}>
                <img className={cx('image')} src={images.logo} alt="logo" />
            </div>
            <Menu
                onClick={handleMenuItemClick}
                className={cx('menu')}
                mode="inline"
                items={items}
                selectedKeys={[location.pathname + location.search || '']}
            />
        </>
    );
}

export default AdminSideBar;
