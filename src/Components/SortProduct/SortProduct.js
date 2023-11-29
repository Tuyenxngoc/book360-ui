import PropTypes from 'prop-types';

import Style from './SortProduct.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

const SortProduct = ({ handleSortChange, filters }) => {

    const handleSelectChange = ({ target: { value, selectedIndex } }) => {
        handleSortChange(value, selectedIndex % 2 !== 0);
    };

    return (
        <div className={cx('wrapper')}>
            <span className={cx('label')}>Sắp xếp theo</span>
            <button
                className={cx('item', { active: filters.sortBy === 'createdDate' })}
                onClick={() => handleSortChange('createdDate')}>Mới nhất
            </button>
            <button
                className={cx('item', { active: filters.sortBy === 'selled' })}
                onClick={() => handleSortChange('selled')}>Bán chạy
            </button>
            <select onChange={(e) => handleSelectChange(e)} className={cx('item', 'select')}>
                <option value="">Tùy chọn</option>
                <option value="name">Tên A-Z</option>
                <option value="name">Tên Z-A</option>
                <option value="price">Giá tăng dần</option>
                <option value="price">Giá giảm dần</option>
            </select>

        </div>
    );
};

SortProduct.propTypes = {
    handleSortChange: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
};

export default SortProduct;
