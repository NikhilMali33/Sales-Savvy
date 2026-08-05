import "../../styles/SearchBar.css";

function SearchBar() {

    return (
        <div className="search-container">

            <input
                type="text"
                placeholder="Search products..."
                className="search-input"
            />

        </div>
    );

}

export default SearchBar;