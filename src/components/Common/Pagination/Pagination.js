import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames/bind';
import Style from './Pagination.module.scss';

const cx = classNames.bind(Style);

function Pagination({ pagination, onPageChange }) {
    const { pageNum, totalPages } = pagination;
    const maxDisplayPages = 5;
    const startPage = Math.max(1, pageNum - Math.floor(maxDisplayPages / 2));
    const endPage = Math.min(startPage + maxDisplayPages - 1, totalPages);
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <nav className={cx('wrapper')}>
            <ul className={cx('pagination')}>
                <PaginationItem onClick={() => handlePageChange(pageNum)} disabled={pageNum === 1}>
                    &laquo;
                </PaginationItem>
                {pageNumbers.map((number) => (
                    <PaginationItem
                        key={number}
                        onClick={() => {
                            if (number - 1 !== pageNum) {
                                handlePageChange(number);
                            }
                        }}
                        disabled={pageNum === number - 1}
                        current={pageNum === number - 1}
                    >
                        {number}
                    </PaginationItem>
                ))}
                <PaginationItem onClick={() => handlePageChange(pageNum + 2)} disabled={pageNum === totalPages}>
                    &raquo;
                </PaginationItem>
            </ul>
        </nav>
    );
}

const PaginationItem = ({ onClick, disabled, current, children }) => (
    <li onClick={onClick} disabled={disabled} className={cx('page-item', { current })}>
        {children}
    </li>
);

PaginationItem.propTypes = {
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    current: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

Pagination.propTypes = {
    pagination: PropTypes.object.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
