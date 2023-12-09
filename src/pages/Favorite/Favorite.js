import { useState, useEffect } from 'react';

import useAuth from '~/hooks/useAuth';
import Product from '~/components/Product';
import { getFavoriteProducts } from '~/services/customerService';

import Style from './Favorite.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(Style);

function Favorite() {

    const [data, setData] = useState([]);
    const { customer } = useAuth();

    useEffect(() => {
        getFavoriteProducts(customer.customerId)
            .then((response) => setData(response.data.data.items))
            .catch((error) => console.error(error));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('main-content')}>
            <div className="row">
                <div className="col-12">
                    <div className={cx('header')}>
                        <h3 className={cx('title')}>Sản phẩm yêu thích</h3>
                    </div>
                </div>
            </div>

            <div className="row pt-4">
                {data.length > 0 ? (
                    data.map((product) => (
                        <div key={product.productId} className="col-2-4 mb-4">
                            <Product data={product} ></Product>
                        </div>
                    ))
                ) : (
                    <div className='pb-4'>Hiện tại bạn chưa có sản phẩm yêu thích nào</div>
                )}
            </div>
        </div>
    );
}

export default Favorite;