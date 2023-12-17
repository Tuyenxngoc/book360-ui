import MoneyDisplay from "~/components/MoneyDisplay";

import Style from './ManageBanners.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(Style);

function TableBanners({ listBanners }) {
    return (
        <table className="table table-hover table-bordered" style={{ verticalAlign: 'middle' }}>
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">IMAGE</th>
                </tr>
            </thead>
            <tbody>
                {listBanners && listBanners.length > 0 ? (
                    listBanners.map((item, index) => {
                        return (
                            <tr key={`table-products-${index}`}>
                                <td>{item.id}</td>
                                <td >
                                    <div className={cx('banner-image')}>
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                ) : (
                    <tr>
                        <td colSpan="2">Not found data</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default TableBanners;