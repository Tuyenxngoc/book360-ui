import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

function Breadcrumbs({ breadcrumbs, currentPage }) {
    return (
        <div className="container">
            <nav aria-label="breadcrumb" className="my-3">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                        <Link to="/">Trang chủ</Link>
                    </li>
                    {breadcrumbs && breadcrumbs.map((item, i) => {
                        return (
                            <li key={i} className="breadcrumb-item">
                                <Link to={item.url}>{item.label}</Link>
                            </li>
                        )
                    })}
                    <li className="breadcrumb-item active" aria-current="page">{currentPage}</li>
                </ol>
            </nav>
        </div>
    );
}

Breadcrumbs.prototype = {
    currentPage: PropTypes.string.isRequired
}

export default Breadcrumbs;
