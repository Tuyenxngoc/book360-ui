import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import images from "~/assets";
import { routes } from "~/config";
import { getAuthorDetail } from "~/services/authorService";

function AuthorDetail() {

    const { authorId } = useParams();
    const [authorData, setAuthorData] = useState({});

    useEffect(() => {
        if (authorId) {
            getAuthorDetail(authorId)
                .then((response) => {
                    setAuthorData(response.data.data)
                })
                .catch((error) => { console.log(error); })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authorId]);

    return (
        <div>
            <Link to={routes.viewAuthors}>quay lại</Link>
            <div>Ngày tạo: {authorData.createdDate}</div>
            <div>Ngày sửa đổi lần cuối: {authorData.lastModifiedDate}</div>
            <div>Tạo bởi: {authorData.createdBy}</div>
            <div>Sửa bởi: {authorData.lastModifiedBy}</div>
            <div>Id: {authorData.id}</div>
            <div>Tên tác giả: {authorData.fullName}</div>
            <div>Tiểu sử: {authorData.biography}</div>
            <div >
                <img style={{ width: '250px' }} src={authorData.avatar || images.imageDefault} alt="avt" />
            </div>
            {authorData.products && authorData.products.length > 0 ?
                (authorData.products.map((product, index) => (
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

export default AuthorDetail;
