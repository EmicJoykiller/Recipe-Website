import React, { useState, useEffect } from 'react';
import './CSS/Sbar.css'
import './CSS/Home.css'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [firstRecipe, setFirstRecipe] = useState(null); //UPDATE1

  useEffect(() => {
    fetch('/recipes')
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          setFirstRecipe(data[0]); // Armazena a primeira receita
        }
      })
      .catch(error => console.error('Error fetching recipes:', error));
  }, []); //UPDATE1


  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');
    setIsSearching(true); // Indicate that a search is in progress

    try {
      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeName: searchTerm }),
      });

      setIsSearching(false); // Search finished

      if (response.ok) {
        const data = await response.json();
        setRecipe(data);
      } else {
        setError('Recipe not found.');
        setRecipe(null);
      }
    } catch (err) {
      setIsSearching(false); // Search finished
      setError('Failed to fetch the recipe. Please try again later.');
      setRecipe(null);
    }
  };

  // Use this to debug what is actually being set in state
  console.log({ searchTerm, recipe, error, isSearching });

  return (
    <>
      <h1 className="center-text">Welcome to Recipe Website!</h1>
      <img src="ori_banner.jpg" alt="Recipe Website Banner" style={{ width: '100%', height: 'auto' }} />
      <div className="search-container">
        <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for recipes..."
            required

            style={{
              padding: '12px',
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '10px'
            }}

          />
          <button type="submit" disabled={isSearching} style={{ padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>Search</button>
        </form>
      </div>

      {isSearching && <p>Searching...</p>}
      {error && <p>Error: {error}</p>}
      {!isSearching && recipe && (
        <div>
          <h2>Recipe Found:</h2>
          <p><strong>Name:</strong> {recipe.name}</p>
          {/* Display the recipe image if it exists */}
          {recipe.image && <img src={recipe.image} alt={recipe.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />}
          <p><strong>Ingredients:</strong> {recipe.ingredients?.join(', ')}</p>
          <p><strong>Instructions:</strong> {recipe.instructions}</p>
        </div>
      )}

      {/* FirstRecipe */}
      {firstRecipe && (
        <div className="featured-recipe">
          <h2>Top Recipe:</h2>
          <p><strong>Name:</strong> {firstRecipe.name}</p>
          {firstRecipe.image && (
            <img src={firstRecipe.image} alt={firstRecipe.name} />
          )}
          <p><strong>Ingredients:</strong> {firstRecipe.ingredients?.join(', ')}</p>
          <p><strong>Instructions:</strong> {firstRecipe.instructions}</p>
        </div>
      )}
    </>
  );
}
