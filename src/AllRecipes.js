import React, { useState, useEffect } from 'react';

function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/recipes')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setRecipes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>All Recipes</h1>
      <div className="recipes-container">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="recipe-card">
            <div className="recipe-text">
              <h3>{recipe.name}</h3>
              <img src={recipe.image} alt={`Image of ${recipe.name}`} className="recipe-image" />
              <h4>Ingredients:</h4>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h4>Instructions:</h4>
              <p>{recipe.instructions}</p>
              <div className="like-dislike-container">
                <button>Like</button>
                <span>Likes: {recipe.likes}</span>
                <button>Dislike</button>
                <span>Dislikes: {recipe.dislikes}</span>
              </div>
              {/* If there are additional details you want to display, add them here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllRecipes;
