import PropTypes from 'prop-types';

import Style from './SortProduct.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

const SortProduct = ({ handleSortChange, filters }) => {

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        const isAscending = e.target.options[e.target.selectedIndex].getAttribute('data-isascending');
        handleSortChange(selectedValue, isAscending);
    };

    return (
        <div className={cx('wrapper')}>
            <span>Sắp xếp theo</span>
            <button
                className={cx('item', { active: filters.sortBy === 'createdDate' })}
                onClick={() => handleSortChange('createdDate')}
            >
                Mới nhất
            </button>
            <button
                className={cx('item', { active: filters.sortBy === 'selled' })}
                onClick={() => handleSortChange('selled')}
            >
                Bán chạy
            </button>
            <select onChange={(e) => handleSelectChange(e)} className={cx('item', 'select')}>
                <option data-isascending="false" value="">Tùy chọn</option>
                <option data-isascending="true" value="name">Tên A-Z</option>
                <option data-isascending="false" value="name">Tên Z-A</option>
                <option data-isascending="true" value="price">Giá tăng dần</option>
                <option data-isascending="false" value="price">Giá giảm dần</option>
            </select>

        </div>
    );
};

SortProduct.propTypes = {
    handleSortChange: PropTypes.func.isRequired,
    filters: PropTypes.object.isRequired,
};

export default SortProduct;
