import { useEffect, useState } from "react";
import request from "~/utils/request";
import { useParams } from 'react-router-dom';


function BookDetails() {
    const { id } = useParams();
    const [data, setData] = useState({});
    // Xử lý logic với Id
    useEffect(() => {
        request
            .get(`product/get-product-detail/${id}`)
            .then((response) => { setData(response.data.data) })
            .catch((error) => { console.log(error.response.data.message); });
    }, []);

    return (
        <div>
            {data.description}
        </div>
    )
}

export default BookDetails;