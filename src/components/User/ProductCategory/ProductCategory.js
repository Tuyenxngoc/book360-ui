import PropTypes from 'prop-types';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faBars, faBook } from '@fortawesome/free-solid-svg-icons';
import { Skeleton } from '@mui/material';

//Style
import Style from './ProductCategory.module.scss';
import classNames from 'classnames/bind';
import { getCategories } from '~/services/categoryService';

const cx = classNames.bind(Style);

const skeletonItems = Array.from({ length: 9 }, (_, index) => (
    <Skeleton animation="wave" key={index} className="mt-2" variant="rounded" height={31} />
));

function ProductCategory({ children }) {
    const [listCategory, setListCategory] = useState();

    useEffect(() => {
        getCategories('pageSize=7')
            .then((response) => {
                const { items } = response.data.data;
                setListCategory(items);
            })
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
                                    <i>
                                        <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
                                    </i>
                                    Danh mục sản phẩm
                                </h2>
                                <ul className={cx('list')}>
                                    <li className={cx('item')}>
                                        <Link className={cx('item-link')} to={`/search?keyword=`}>
                                            <FontAwesomeIcon icon={faBook} />
                                            <span>Tất cả sản phẩm</span>
                                        </Link>
                                    </li>
                                    {listCategory.map((item, index) => (
                                        <li key={index} className={cx('item')}>
                                            <Link className={cx('item-link')} to={`category/${item.id}`}>
                                                <FontAwesomeIcon icon={faBook} />
                                                <span>{item.name.toUpperCase()}</span>
                                            </Link>
                                        </li>
                                    ))}
                                    <li className={cx('item', 'sup-item')}>
                                        <div className={cx('item-link', 'd-flex', 'justify-content-between')}>
                                            <div>
                                                <FontAwesomeIcon icon={faBook} />
                                                <span>Độ tuổi</span>
                                            </div>
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        </div>

                                        <ul className={cx('sub-item')}>
                                            <li className={cx('item')}>
                                                <Link className={cx('item-link')} to={'/search?keyword=y'}>
                                                    Nhà trẻ, Mẫu giáo (0-5 tuổi)
                                                </Link>
                                            </li>
                                            <li className={cx('item')}>
                                                <Link className={cx('item-link')} to={'/search?keyword=y'}>
                                                    Nhi đồng (6-10 tuổi)
                                                </Link>
                                            </li>
                                            <li className={cx('item')}>
                                                <Link className={cx('item-link')} to={'/search?keyword=y'}>
                                                    Thiếu niên (11-15 tuổi)
                                                </Link>
                                            </li>
                                            <li className={cx('item')}>
                                                <Link className={cx('item-link')} to={'/search?keyword=y'}>
                                                    Tuổi mới lớn (16-18 tuổi)
                                                </Link>
                                            </li>
                                            <li className={cx('item')}>
                                                <Link className={cx('item-link')} to={'/search?keyword=y'}>
                                                    Tuổi trưởng thành (Trên 18 tuổi)
                                                </Link>
                                            </li>
                                        </ul>
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
                    <div className="col-9">{children}</div>
                </div>
            </div>
        </nav>
    );
}

ProductCategory.propTypes = {
    children: PropTypes.node,
};

export default ProductCategory;
