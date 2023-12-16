import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import TableOrders from "./TableOrders";
import { useEffect, useState } from "react";

function ManageOrders() {
    const [dataOrders, setDataOrders] = useState([]);


    const fetchListProduct = () => {

    }

    useEffect(() => {
        fetchListProduct();
    }, [])


    return (
        <div className="container">
            <div className="info">
                <h4>Quản lý đơn hàng</h4>
                <Button variant="contained" startIcon={<FontAwesomeIcon icon={faPlus} />}>Thêm mới</Button>
            </div>

            <TableOrders />
        </div>
    );
}

export default ManageOrders;