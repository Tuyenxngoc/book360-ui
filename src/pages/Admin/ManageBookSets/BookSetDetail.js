import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import images from "~/assets";
import { routes } from "~/config";
import { getBookSetDetail } from "~/services/bookSetService";

function BookSetDetail() {

    const { bookSetId } = useParams();
    const [bookSetData, setbookSetData] = useState({});

    useEffect(() => {
        if (bookSetId) {
            getBookSetDetail(bookSetId)
                .then((response) => {
                    setbookSetData(response.data.data)
                })
                .catch((error) => { console.log(error); })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookSetId]);

    return (
        <div>
            <Link to={routes.viewBookSets}>quay lại</Link>
            <div>Ngày tạo: {bookSetData.createdDate}</div>
            <div>Ngày sửa đổi lần cuối: {bookSetData.lastModifiedDate}</div>
            <div>Tạo bởi: {bookSetData.createdBy}</div>
            <div>Sửa bởi: {bookSetData.lastModifiedBy}</div>
            <div>Id: {bookSetData.id}</div>
            <div>Tên bộ sách: {bookSetData.name}</div>
            {bookSetData.products && bookSetData.products.length > 0 ?
                (bookSetData.products.map((product, index) => (
                    <div key={index}>
                        <img style={{ width: '250px' }} src={product.image} alt="product img" />
                        <div>{product.name}</div>
                    </div>
                ))) : (
                    <div>Chưa có sản phẩm</div>
                )
            }
        </div>
    );
}

export default BookSetDetail;
