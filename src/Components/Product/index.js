import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

function Product(props) {
    return (
        <div className="product-item">
            <div className="product-img">
                <Link to={props.id}>
                    <img src={props.img || 'https://product.hstatic.net/200000343865/product/pages_from_ty_quay_tap6_ruot_172tr__page_01_aee4b3dcdfd6413697cb6f97682b1d61_master.jpg'} alt={props.name} />
                </Link>
                <div className="product-tags">-10%</div>
            </div>
            <div className="product-info">
                <div className="product-title">
                    <Link to={props.id}>{props.name}</Link>
                </div>
                <div className="product-price">
                    <span className="current-price">{props.currentPrice}₫</span>
                    <span className="original-price"><s>{props.originalPrice}₫</s></span>
                </div>
            </div>
        </div>
    );
}
Product.prototype = {
    props: PropTypes.node.isRequired
}

export default Product;