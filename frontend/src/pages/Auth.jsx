import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Auth = () => {
    const { login, register, error, loading, setError, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // If already logged in, redirect to home
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    // Reset error when switching modes
    const handleSwitchMode = () => {
        setIsLogin(!isLogin);
        setError(null);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhoneNumber('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !password.trim()) {
            setError("Email and Password are required fields.");
            return;
        }

        if (isLogin) {
            const success = await login(email, password);
            if (success) {
                navigate('/');
            }
        } else {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            if (password.length < 4) {
                setError("Password must be at least 4 characters long.");
                return;
            }

            const success = await register(email, password, phoneNumber);
            if (success) {
                alert("Account created successfully! You can now log in.");
                setIsLogin(true);
                setPassword('');
                setConfirmPassword('');
            }
        }
    };

    return (
        <div className="auth-page animate-fade-in">
            <div className="auth-card glass">
                <div className="auth-tabs">
                    <button 
                        onClick={() => !isLogin && handleSwitchMode()} 
                        className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => isLogin && handleSwitchMode()} 
                        className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
                    >
                        Register
                    </button>
                </div>

                {error && <div className="auth-error-box">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-input" 
                            placeholder="e.g. name@example.com" 
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input" 
                            placeholder="Enter security password" 
                            required 
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input" 
                                    placeholder="Re-type password" 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input 
                                    type="tel" 
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="form-input" 
                                    placeholder="e.g. 9876543210" 
                                />
                            </div>
                        </>
                    )}

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-lg w-full auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-card-footer">
                    {isLogin ? (
                        <p>New to ApexMarket? <button onClick={handleSwitchMode} className="switch-mode-txt-btn">Create an account</button></p>
                    ) : (
                        <p>Already have an account? <button onClick={handleSwitchMode} className="switch-mode-txt-btn">Sign in instead</button></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;
