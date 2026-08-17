import { Link } from "react-router-dom";
import "../../styles/layout/Breadcrumb.css";

function Breadcrumb({ category, productName }) {
    return (
        <div className="breadcrumb">
            <Link to="/products">Products</Link>

            <span className="separator">›</span>

            <span>{category}</span>

            <span className="separator">›</span>

            <span className="current">{productName}</span>
        </div>
    );
}

export default Breadcrumb;