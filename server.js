const express = require('express');
const path = require('path');
const { MongoClient, ObjectId  } = require('mongodb');


const app = express();
const port = 3000;

// MongoDB Connection URL and Database Name
const url = 'mongodb+srv://meet:meet@cluster0.yqvokoa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'recipie';

let db;

// Initialize MongoDB Client and connect
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log("Connected successfully to MongoDB");
  })
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse JSON bodies

// Serve static files from the React app (adjust the path as necessary)
app.use(express.static(path.join(__dirname, 'build')));

// API routes
app.post('/search', async (req, res) => {
  try {
    const collection = db.collection('recipes');
    const recipeName = req.body.recipeName;

    // Use a case-insensitive search
    const recipe = await collection.findOne({ name: new RegExp(recipeName, 'i') });

    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    console.error('Failed to search for recipe:', err);
    res.status(500).json({ message: 'Error searching for recipe' });
  }
});

// All remaining requests return the React app, so it can handle routing.

app.get('/recipes', async (req, res) => {
  try {
    const collection = db.collection('recipes');
    // Updated to sort by 'likes' in descending order
    const recipes = await collection.find({}).sort({ likes: -1 }).toArray();

    res.json(recipes);
  } catch (err) {
    console.error('Failed to fetch recipes:', err);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
});

app.post('/recipes/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.collection('recipes').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { likes: 1 } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).send('Recipe not found');
    }
    res.status(200).send('Like added');
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

// Increment dislikes
app.post('/recipes/:id/dislike', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.collection('recipes').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { dislikes: 1 } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).send('Recipe not found');
    }
    res.status(200).send('Dislike added');
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
  
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.collection('users').findOne({ username });
  if (user && user.password === password) { 
    res.json({ message: 'Login successful', userId: user._id });
  } else {
    res.status(401).json({ message: 'Login failed' });
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const result = await db.collection('users').insertOne({ username, password, savedRecipes: [] });
  if (result.acknowledged) {
    res.json({ message: 'Signup successful' });
  } else {
    res.status(500).json({ message: 'Signup failed' });
  }
});
// Save recipe for a user
app.post('/users/:userId/recipes/:recipeId/save', async (req, res) => {
  const { userId, recipeId } = req.params;
  try {
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { savedRecipes: new ObjectId(recipeId) } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('Recipe saved successfully');
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
  
});


app.get('/users/:userId/recipes/saved', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    const savedRecipes = await db.collection('recipes').find({ _id: { $in: user.savedRecipes } }).toArray();
    res.json(savedRecipes);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});




app.get('*', function(request, response) {
  response.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
