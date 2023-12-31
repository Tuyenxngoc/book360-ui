import { Menu } from 'antd';
import { BoldOutlined, DollarOutlined, HomeOutlined, OrderedListOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
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
    getItem('Quản lý khách hàng', routes.viewUser, <UserOutlined />),
    getItem('Quản lý sản phẩm', 'product', <DollarOutlined />, [
        getItem('Tất cả sản phẩm', routes.viewProduct),
        getItem('Thêm sản phẩm', routes.createProduct),
    ]),
    getItem('Quản lý đơn hàng', 'order', <ShoppingCartOutlined />, [
        getItem('Tất cả', routes.viewOder),
        getItem('Đơn hủy', `${routes.viewOder}?type=canceled`),
    ]),
    getItem('Quản lý banner', routes.viewBanner, <BoldOutlined />),
    getItem('Quản lý danh mục', routes.viewCategory, <OrderedListOutlined />),
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
    }

    return (
        <>
            <div className={cx('logo')}>
                <img className={cx('image')} src={images.logo} alt='logo' />
            </div>
            <Menu
                onClick={handleMenuItemClick}
                className={cx('menu')}
                mode='inline'
                items={items}
                selectedKeys={[(location.pathname + location.search) || '']}
            />
        </>
    )
}

export default AdminSideBar;
