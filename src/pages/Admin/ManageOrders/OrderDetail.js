import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getBill } from "~/services/billService";

function OrderDetail() {

    const { orderId } = useParams();
    const [orderData, setOrderData] = useState({});

    useEffect(() => {
        getBill(orderId)
            .then((response) => {
                setOrderData(response.data.data);
            })
            .catch((error) => {
                toast.error('Đã có lỗi xảy ra khi lấy dữ liệu đơn hàng');
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <h6>
            {JSON.stringify(orderData)}
        </h6>
    );
}

export default OrderDetail;