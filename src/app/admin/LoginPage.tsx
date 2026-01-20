'use client';

import { useState } from 'react';
import { login } from '../actions';
import styles from './LoginPage.module.css';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await login(password);
        if (res.success) {
            window.location.reload(); // Reload to re-check cookies in page.tsx
        } else {
            setError(res.message || 'Login failed');
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Admin Login</h2>
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.inputGroup}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Admin Password"
                        className={styles.input}
                        required
                    />
                </div>
                <button type="submit" className={styles.button}>Login</button>
            </form>
        </div>
    );
}
