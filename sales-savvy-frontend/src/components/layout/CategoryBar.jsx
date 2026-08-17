import "../../styles/layout/CategoryBar.css";

function CategoryBar({ categories, onCategoryClick }) {

    return (

        <div className="category-bar">

            <button
                className="category-btn"
                onClick={() => onCategoryClick(null)}
            >
                All
            </button>

            {
                categories.map(category => (

                    <button
                        key={category.categoryId}
                        className="category-btn"
                        onClick={() => onCategoryClick(category.categoryId)}
                    >
                        {category.categoryName}
                    </button>

                ))
            }

        </div>

    );

}

export default CategoryBar;