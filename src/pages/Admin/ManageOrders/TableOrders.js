import MoneyDisplay from '~/components/MoneyDisplay';
import Style from './MagageOrders.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(Style);

function TableOrders({ listProduct, handleClickBtnUpdate, handleClickViewProduct, handleClickBtnDelete }) {
    return (
        <div>
            <table className="table table-hover table-bordered" style={{ verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">IMAGE</th>
                        <th scope="col">QUANTITY</th>
                        <th scope="col">PRICE</th>
                        <th scope="col">DISCOUNT</th>
                        <th scope="col">SELLED</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {listProduct && listProduct.length > 0 ? (
                        listProduct.map((item, index) => {
                            return (
                                <tr key={`table-products-${index}`}>
                                    <td>{item.productId}</td>
                                    <td>
                                        <div className={cx('product-name')}>
                                            {item.name}
                                        </div>
                                    </td>
                                    <td >
                                        <div className={cx('product-image')}>
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td><MoneyDisplay amount={item.price} /></td>
                                    <td>{item.discount}</td>
                                    <td>{item.selled}</td>
                                    <td>
                                        <button
                                            className='btn btn-success'
                                            onClick={() => handleClickViewProduct(item)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className='btn btn-warning mx-3'
                                            onClick={() => handleClickBtnUpdate(item)}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className='btn btn-danger'
                                            onClick={() => handleClickBtnDelete(item)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="6">Not found data</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TableOrders;