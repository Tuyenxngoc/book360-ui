import { Button } from '@mui/material';
import Style from './ManageCategories.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

function TableCategories({ listCategory, handleClickBtnUpdate, handleClickView, handleClickBtnDelete }) {
    return (
        <div>
            {console.log("list", listCategory)}
            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col">Tên danh mục</th>
                        <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listCategory && listCategory.length > 0 &&
                        listCategory.map((item, index) => {
                            return (
                                <tr key={`table-categorys-${index}`}>
                                    <td className={cx('image-category')}>
                                        {item.image ? (
                                            <img src={item.image} alt={`category id ${item.id}`} />
                                        ) : (
                                            <div>chưa có hình ảnh</div>
                                        )}
                                    </td>
                                    <td>{item.name}</td>
                                    <td>
                                        <Button size='small' variant='contained' color='success' onClick={() => handleClickView(item.id)}>
                                            Xem
                                        </Button>
                                        <Button size='small' className='mx-2' variant='contained' color='warning' onClick={() => handleClickBtnUpdate(item.id)}>
                                            Cập nhật
                                        </Button>
                                        <Button size='small' variant='contained' color='error' onClick={() => handleClickBtnDelete(item.id)}>
                                            Xoá
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    {listCategory && listCategory.length === 0
                        && <tr>
                            <td colSpan="4">Not found data</td>
                        </tr>
                    }

                </tbody>
            </table>
        </div>
    );
}

export default TableCategories;