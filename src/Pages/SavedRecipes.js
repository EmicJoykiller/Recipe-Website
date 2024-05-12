import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';

function SavedRecipes() {
    const { user } = useContext(UserContext);
    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        if (user.loggedIn) {
            fetch(`/users/${user.userId}/recipes/saved`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch saved recipes');
                    }
                    return response.json();
                })
                .then(data => setSavedRecipes(data))
                .catch(error => console.error('Failed to fetch saved recipes:', error));
        }
    }, [user]);

    return (
        <div>
            <h1>Saved Recipes</h1>
            {user.loggedIn ? (
                savedRecipes.length > 0 ? (
                    savedRecipes.map(recipe => (
                        <div key={recipe._id}>
                            <h3>{recipe.name}</h3>
                            <img src={recipe.image} alt={`Image of ${recipe.name}`} />
                            <p><strong>Description:</strong> {recipe.description}</p>
                            <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                            <p><strong>Instructions:</strong> {recipe.instructions}</p>
                        </div>
                    ))
                ) : (
                    <p>No saved recipes found.</p>
                )
            ) : (
                <p>Please log in to view saved recipes.</p>
            )}
        </div>
    );
}

export default SavedRecipes;
