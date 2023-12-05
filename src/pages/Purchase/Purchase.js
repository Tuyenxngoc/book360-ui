import { axiosPrivate } from '~/utils/httpRequest';
import useAuth from '~/hooks/useAuth';
import PurchaseTab from '~/components/PurchaseTab';
import { useState, useEffect } from 'react';
import { buyAgain, cancelOrder } from '~/services/billService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faClipboard } from '@fortawesome/free-regular-svg-icons';

function Purchase() {

    const { customer } = useAuth();
    const [data, setData] = useState([]);

    const handleCancelOrder = (billId) => {
        cancelOrder(billId)
            .then((response) => {
                console.log(response);
                const updatedData = data.map((item) =>
                    item.id === billId ? { ...item, status: 'canceled' } : item
                );
                console.log(updatedData);
                setData(updatedData);
            })
            .catch((error) => { console.log(error); })
    }
    const handleBuyAgain = (billId) => {
        buyAgain(billId)
            .then((response) => { console.log(response); })
            .catch((error) => { console.log(error); })
    }

    useEffect(() => {
        axiosPrivate.get(`bill/get-bills/${customer.customerId}`)
            .then((response) => {
                const xxx = response.data.data.items;
                console.log(xxx);
                setData(xxx);
            })
            .catch((error) => { console.log(error); })
    }, [])

    return (
        <div className="container">
            <div className='row'>
                <div className='col-2'>

                    <div className='sidebar'>
                        <ul>
                            <li>
                                <Link to="/profile">
                                    <span className='icon'><FontAwesomeIcon icon={faUser} /></span>
                                    <span>Tài khoản của tôi</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/purchase">
                                    <span className='icon'><FontAwesomeIcon icon={faClipboard} /></span>
                                    <span>Đơn mua</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/">
                                    <span className='icon'><FontAwesomeIcon icon={faBell} /></span>
                                    <span>Thông báo</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>
                <div className='col-10'>
                    {data.map((data, index) =>
                        <PurchaseTab
                            key={index}
                            data={data}
                            handleCancelOrder={handleCancelOrder}
                            handleBuyAgain={handleBuyAgain} />)}
                </div>
            </div>
        </div>
    );
}

export default Purchase;

