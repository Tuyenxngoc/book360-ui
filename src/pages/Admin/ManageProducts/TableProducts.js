import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MoneyDisplay from '~/components/Common/MoneyDisplay';
import AlertDialog from '~/components/Common/AlertDialog';

import Style from './ManageProducts.module.scss';
import classNames from 'classnames/bind';

import { deleteProduct } from '~/services/productService';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faRemove } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(Style);

function TableProducts({ listProduct, fetchListProduct }) {
    const navigate = useNavigate();
    const [showModalDeleteProduct, setShowModalDeleteProduct] = useState(false);
    const [productIdSelect, setProductIdSelect] = useState();

    const handleClickBtnUpdate = (id) => {
        navigate(`/admin/product/${id}`);
    };

    const handleClickViewProduct = (id) => {
        navigate(`/product/${id}`);
    };

    const handleClickBtnDelete = (id) => {
        setShowModalDeleteProduct(true);
        setProductIdSelect(id);
    };

    const handleDeleteProduct = () => {
        deleteProduct(productIdSelect)
            .then(() => {
                fetchListProduct();
                toast.success('Xoá thành công');
            })
            .catch(() => {
                toast.error('Có lỗi sảy ra');
            });
    };

    return (
        <div>
            <AlertDialog
                open={showModalDeleteProduct}
                setOpen={setShowModalDeleteProduct}
                title={'Xóa sản phẩm'}
                description={
                    'Bạn có chắc muốn xóa sản phẩm này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục sản phẩm.'
                }
                handleSubmit={handleDeleteProduct}
            />
            <table className="table table-striped table-bordered" style={{ verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th scope="col" colSpan={2}>
                            Tên sản phẩm
                        </th>
                        <th scope="col">Danh mục</th>
                        <th scope="col">Kho hàng</th>
                        <th scope="col">Giá</th>
                        <th scope="col">Giảm giá</th>
                        <th scope="col">Doanh số</th>
                        <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listProduct && listProduct.length > 0 ? (
                        listProduct.map((item, index) => {
                            return (
                                <tr key={`table-products-${index}`}>
                                    <td colSpan={2}>
                                        <div className={cx('product-list-item')}>
                                            <div className={cx('product-image')}>
                                                <img src={item.featuredImage} alt={item.name} />
                                            </div>
                                            <div className={cx('product-name')}>{item.name}</div>
                                        </div>
                                    </td>
                                    <td>{item.category.name}</td>
                                    <td>{item.stockQuantity}</td>
                                    <td>
                                        <MoneyDisplay amount={item.price} />
                                    </td>
                                    <td>{item.discount}%</td>
                                    <td>{item.soldQuantity}</td>
                                    <td>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleClickViewProduct(item.id)}
                                            sx={{ minWidth: 35, height: 35 }}
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="info"
                                            onClick={() => handleClickBtnUpdate(item.id)}
                                            sx={{ minWidth: 35, height: 35, mx: 1 }}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleClickBtnDelete(item.id)}
                                            sx={{ minWidth: 35, height: 35 }}
                                        >
                                            <FontAwesomeIcon icon={faRemove} />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8">
                                <div className={cx('no-result')}>
                                    <div className={cx('icon')} />
                                    <div className={cx('text')}>Không tìm thấy sản phẩm</div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TableProducts;
