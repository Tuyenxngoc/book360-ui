import { Menu } from "antd";
import { DollarOutlined, HomeOutlined, OrderedListOutlined, PoweroffOutlined, ShopOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import images from '~/assets';

import classNames from 'classnames/bind';
import styles from './AdminSideBar.module.scss';

const cx = classNames.bind(styles);

function AdminSideBar() {
    const navigate = useNavigate();

    const handleMenuItemClick = ({ key }) => {
        if (key === "signout") {
            navigate("/");
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
                items={[
                    { label: "Trang chủ", key: "/admin", icon: <HomeOutlined /> },
                    { label: "Quản lý khách hàng", key: "/admin/users", icon: <UserOutlined /> },
                    { label: "Quản lý sản phẩm", key: "/admin/products", icon: <DollarOutlined /> },
                    { label: "Quản lý đơn hàng", key: "/admin/orders", icon: <ShoppingCartOutlined /> },
                    { label: "Quản lý banner", key: "/admin/banners", icon: <ShopOutlined /> },
                    { label: "Quản lý danh mục", key: "/admin/categories", icon: <OrderedListOutlined /> },
                    { label: "Đăng xuất", key: "signout", icon: <PoweroffOutlined /> },
                ]}
            />
        </>
    )
}
export default AdminSideBar;
