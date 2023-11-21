import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import httpRequest from "~/utils/httpRequest";

//Css
import Style from './ProductCategory.module.scss'
import classNames from 'classnames/bind';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBook } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(Style);

function ProductCategory({ children }) {
    const [listCategory, setListCategory] = useState([]);
    useEffect(() => {
        httpRequest
            .get('category/get-categories')
            .then((response) => setListCategory(response.data.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className="container">
                <div className="row g-1">
                    <div className="col-3">
                        <h2 className={cx('title')}>
                            <i><FontAwesomeIcon icon={faBars}></FontAwesomeIcon></i>
                            Danh mục sản phẩm
                        </h2>
                        <ul className={cx('list')}>
                            {listCategory.map(item => (
                                <li key={item.id} className={cx('item')}>
                                    <Link to={`category/${item.id}`}>
                                        <FontAwesomeIcon icon={faBook} />
                                        <span>{item.name.toUpperCase()}</span>
                                    </Link>
                                </li>
                            )
                            )}
                        </ul>
                    </div>
                    <div className="col-9">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCategory;