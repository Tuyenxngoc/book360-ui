import { useEffect, useState } from 'react';

import { Button, TablePagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Style from './ManageCategories.module.scss';
import classNames from 'classnames/bind';

import { getAllCategories } from '~/services/categoryService';
import TableCategories from './TableCategories';
import { useNavigate } from 'react-router-dom';
import { routes } from '~/config';

const cx = classNames.bind(Style);

function CategoriesDashboard() {

    const navigate = useNavigate();
    const [dataCategories, setDataCategories] = useState([]);

    const fetchListCategory = () => {
        getAllCategories()
            .then((response) => { setDataCategories(response.data.data) })
            .catch((error) => { console.log(error) });
    }

    useEffect(() => {
        fetchListCategory();
    }, [])

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleCreateCategory = () => {
        navigate(routes.createCategory);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className='container my-3'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className={cx('list-main')}>
                        <div className={cx('header')}>
                            <div className={cx('title')}>{dataCategories.length} Danh mục</div>
                            <Button
                                size='small'
                                variant='contained'
                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={handleCreateCategory}
                            >
                                Thêm mới
                            </Button>
                        </div>
                        <div className='content'>
                            <TableCategories listCategory={dataCategories} fetchListCategory={fetchListCategory} />
                            <TablePagination
                                className={cx('table-pagination')}
                                component='div'
                                count={dataCategories.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoriesDashboard;