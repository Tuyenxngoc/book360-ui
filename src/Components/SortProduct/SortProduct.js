import Style from './SortProduct.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);
const SortProduct = ({ handleSortChange, filters }) => {
    function handleSelectChange(event) {
        const selectedOption = event.target.value;
        const selectedIndex = event.target.selectedIndex;
        handleSortChange(selectedOption, selectedIndex % 2 !== 0)
    }

    return (
        <div className={cx('wrapper')}>
            <span className={cx('label')}>Sắp xếp theo</span>

            <button
                className={cx('item', { active: filters.sortBy === 'createdDate' })}
                onClick={() => handleSortChange('createdDate')}>Mới nhất</button>
            <button
                className={cx('item', { active: filters.sortBy === 'selled' })}
                onClick={() => handleSortChange('selled')}>Bán chạy</button>

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

export default SortProduct;
