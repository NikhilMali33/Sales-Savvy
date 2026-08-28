import { Link } from "react-router-dom";
import "../../styles/layout/Breadcrumb.css";

function Breadcrumb({ category, productName }) {
    return (
        <nav
            className="breadcrumb"
            aria-label="Breadcrumb"
        >
            <Link to="/products">
                Products
            </Link>

            <span
                className="separator"
                aria-hidden="true"
            >
                ›
            </span>

            <span>
                {category}
            </span>

            <span
                className="separator"
                aria-hidden="true"
            >
                ›
            </span>

            <span
                className="current"
                aria-current="page"
            >
                {productName}
            </span>
        </nav>
    );
}

export default Breadcrumb;