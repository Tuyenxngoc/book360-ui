import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input } from 'antd';
import { useRef, useState } from 'react';

import Style from './DropdownRender.module.scss';
import classNames from 'classnames/bind';

import PropTypes from 'prop-types';

const cx = classNames.bind(Style);

function DropdownRender({ menu, field, setFieldValue, options, customValues, setCustomValues }) {
    const [value, setValue] = useState('');
    const [isShowInput, setIsShowInput] = useState(false);
    const inputRef = useRef(null);

    const addItem = (e) => {
        e.preventDefault();
        setFieldValue(field, value);
        // Check if the value already exists in the options array
        const isValueExist = options.some((option) => option.value === value);
        if (!isValueExist) {
            const newValues = [...customValues, { value: value, label: value }];
            setCustomValues(newValues);
            localStorage.setItem(field, JSON.stringify(newValues));
        }
        // Clear the input value and close the input field
        setValue('');
        handleCloseInput();
    };

    const onNameChange = (event) => {
        setValue(event.target.value);
    };

    const handleShowInput = () => {
        setIsShowInput(true);
    };

    const handleCloseInput = () => {
        setIsShowInput(false);
    };

    return (
        <>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <div className={cx('dropdown-container')}>
                {isShowInput ? (
                    <div className={cx('input-container')}>
                        <Input
                            size="small"
                            className={cx('input')}
                            placeholder="Nhập vào"
                            ref={inputRef}
                            value={value}
                            onChange={onNameChange}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                        <Button
                            disabled={!value}
                            className={cx('button')}
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={addItem}
                            style={{ marginRight: '4px' }}
                        />
                        <Button
                            className={cx('button')}
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={handleCloseInput}
                        />
                    </div>
                ) : (
                    <div className={cx('add-item')} onClick={handleShowInput}>
                        <PlusOutlined />
                        <span>Thêm thuộc tính mới</span>
                    </div>
                )}
            </div>
        </>
    );
}

DropdownRender.propTypes = {
    menu: PropTypes.node.isRequired,
    field: PropTypes.string.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ).isRequired,
    customValues: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        }),
    ).isRequired,
    setCustomValues: PropTypes.func.isRequired,
};

export default DropdownRender;
