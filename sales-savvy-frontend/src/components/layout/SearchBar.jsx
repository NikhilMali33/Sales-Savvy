import "../../styles/layout/SearchBar.css";

function SearchBar({ searchTerm, setSearchTerm }) {

    return (
        <div className="search-container">

            <input
                type="text"
                placeholder="Search products..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

        </div>
    );

}

export default SearchBar;