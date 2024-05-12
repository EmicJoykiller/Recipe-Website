import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages/CSS/Auth.css';
import { UserContext } from './UserContext';

function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [authError, setAuthError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false); // Modal state
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setAuthError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLoginView ? '/login' : '/signup';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (response.ok) {
                setUser({ loggedIn: true, email: credentials.username, userId: data.userId });
                setSuccessMessage(isLoginView ? 'Login Successful!' : 'Account Created!');
                if (!isLoginView) {
                    setShowModal(true); // Show the modal on successful signup
                } else {
                    navigate('/recipes'); // Navigate directly to recipes after login
                }
            } else {
                setAuthError(data.message || 'Failed to authenticate. Please try again.');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            setAuthError('An error occurred. Please try again later.');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        navigate('/recipes'); // Optionally redirect to recipes after closing the modal
    };

    return (
        <>
            <div className="auth-container">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <h2>{isLoginView ? 'Login' : 'Sign Up'}</h2>
                    {authError && <p className="error">{authError}</p>}
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <button type="submit">{isLoginView ? 'Login' : 'Sign Up'}</button>
                </form>
                <button type="button" className="toggle" onClick={toggleView}>
                    {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                </button>
                {successMessage && <p className="success">{successMessage}</p>}
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <p>Please log out and log back in to fully activate your account for recipe saving.</p>
                        <button onClick={closeModal}>OK</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default AuthPage;
