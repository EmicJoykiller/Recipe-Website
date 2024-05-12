import React from 'react';
import Navbar from "./navbar";
import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
import About from "./Pages/About";
import { Route, Routes } from "react-router-dom";
import Recipes from './Recipes';
import AuthPage from './AuthPage';
import SavedRecipes from './Pages/SavedRecipes';
import ProtectedRoute from './ProtectedRoute'; // Make sure to import the new component
import AllRecipes from './AllRecipes'; // Make sure to import the new page

function App() {
    return (
        <>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/recipes" element={<ProtectedRoute><Recipes /></ProtectedRoute>} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/savedrecipes" element={<ProtectedRoute><SavedRecipes /></ProtectedRoute>} />
                    <Route path="/allrecipes" element={<AllRecipes />} />

                </Routes>
            </div>
        </>
    )
}

export default App;
