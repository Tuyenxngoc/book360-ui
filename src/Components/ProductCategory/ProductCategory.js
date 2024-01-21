import PropTypes from 'prop-types';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBook } from '@fortawesome/free-solid-svg-icons';
import { Skeleton } from '@mui/material';

//Style
import Style from './ProductCategory.module.scss'
import classNames from 'classnames/bind';
import { getCategories } from '~/services/categoryService';

const cx = classNames.bind(Style);

const skeletonItems = Array.from({ length: 9 }, (_, index) => (
    <Skeleton animation="wave" key={index} className='mt-2' variant="rounded" height={31} />
));

function ProductCategory({ children }) {

    const [listCategory, setListCategory] = useState();

    useEffect(() => {
        getCategories()
            .then((response) => setListCategory(response.data.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <nav className={cx('wrapper')}>
            <div className="container">
                <div className="row gx-2">
                    <div className="col-3">
                        {listCategory ? (
                            <div className={cx('content')}>
                                <h2 className={cx('title')}>
                                    <i><FontAwesomeIcon icon={faBars}></FontAwesomeIcon></i>
                                    Danh mục sản phẩm
                                </h2>
                                <ul className={cx('list')}>
                                    {listCategory.map((item, index) => {
                                        if (index > 7) {
                                            return null;
                                        }
                                        return (
                                            <li key={item.id} className={cx('item')}>
                                                <Link to={`category/${item.id}`}>
                                                    <FontAwesomeIcon icon={faBook} />
                                                    <span>{item.name.toUpperCase()}</span>
                                                </Link>
                                            </li>
                                        )
                                    })}

                                    <li className={cx('item')}>
                                        <Link to={`/search?keyword=`}>
                                            <FontAwesomeIcon icon={faBook} />
                                            <span>Tất cả sản phẩm</span>
                                        </Link>
                                    </li>

                                </ul>
                            </div>
                        ) : (
                            <>
                                <Skeleton animation="wave" variant="rectangular" height={50} />
                                {skeletonItems}
                            </>
                        )}
                    </div>
                    <div className="col-9">
                        {children}
                    </div>
                </div>
            </div>
        </nav>
    );
}

ProductCategory.propTypes = {
    children: PropTypes.node,
};

export default ProductCategory;