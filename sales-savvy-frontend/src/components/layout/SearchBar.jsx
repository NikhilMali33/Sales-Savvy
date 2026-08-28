import "../../styles/layout/SearchBar.css";

function SearchBar({ searchTerm, setSearchTerm }) {

    return (
        <div
            className="search-container"
            role="search"
        >
            <label
                htmlFor="product-search"
                className="search-label"
            >
                Search products
            </label>

            <input
                id="product-search"
                name="product-search"
                type="search"
                placeholder="Search products..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );

}

export default SearchBar;