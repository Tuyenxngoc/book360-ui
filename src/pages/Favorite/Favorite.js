import { useState } from 'react';
import Style from './Favorite.module.scss';
import classNames from "classnames/bind";
import { useEffect } from 'react';
import httpRequest from '~/utils/httpRequest';
import Product from '~/components/Product';

const cx = classNames.bind(Style);

function Favorite() {

    const [data, setData] = useState([]);

    useEffect(() => {
        httpRequest
            .get(`product/find-product`)
            .then((response) => setData(response.data.data.items))
            .catch((error) => console.error(error));
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