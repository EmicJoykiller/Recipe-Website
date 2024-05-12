import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchRecipes();
  }, [user.loggedIn]);

  const fetchRecipes = () => {
    fetch('/recipes')
      .then(response => response.json())
      .then(data => setRecipes(data))
      .catch(error => console.error('Error fetching recipes:', error));
  };

  const handleSaveRecipe = (recipeId) => {
    if (!user || !user.loggedIn || !user.userId) {
      console.log('User is not logged in or missing user ID.');
      return;
    }
    fetch(`/users/${user.userId}/recipes/${recipeId}/save`, { method: 'POST' })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Recipe saved successfully');
          // Optionally trigger a state update to show the saved status
        } else {
          console.error('Error saving recipe:', data.message);
        }
      })
      .catch(error => console.error('Error saving recipe:', error));
  };
  

  const handleLike = (id) => {
    fetch(`/recipes/${id}/like`, { method: 'POST' })
      .then(() => fetchRecipes()) // Re-fetch recipes to update the like count
      .catch(error => console.error('Error liking recipe:', error));
  };

  const handleDislike = (id) => {
    fetch(`/recipes/${id}/dislike`, { method: 'POST' })
      .then(() => fetchRecipes()) // Re-fetch recipes to update the dislike count
      .catch(error => console.error('Error disliking recipe:', error));
  };

  return (
    <div>
      <h2>Recipes List</h2>
      {recipes.map((recipe) => (
        <div key={recipe._id} className="recipe-card">
          <div className="recipe-text">
            <h3>{recipe.name}</h3>
            {user.loggedIn && (
              <button onClick={() => handleSaveRecipe(recipe._id)}>Save Recipe</button>
            )}
            {recipe.image && (
              <img src={recipe.image} alt={`Image of ${recipe.name}`} className="recipe-image" />
            )}
            {user.loggedIn && (
              <div className="like-dislike-container">
                <button onClick={() => handleLike(recipe._id)}>Like</button>
                <span>Likes: {recipe.likes}</span>
                <button onClick={() => handleDislike(recipe._id)}>Dislike</button>
                <span>Dislikes: {recipe.dislikes}</span>
              </div>
            )}
            <h4>Ingredients:</h4>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h4>Instructions:</h4>
            <p>{recipe.instructions}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Recipes;
