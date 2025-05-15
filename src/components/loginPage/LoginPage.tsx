import React from 'react';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  return (
    <div className={styles.fullScreenBackground}>
      <div className={styles.loginWrapper}>
        <h1 className={styles.loginHeader}>Welcome to Poker Game</h1>
        <div className={styles.loginBox}>
          <h2 className={styles.formTitle}>Logga in</h2>
          <form className={styles.loginForm}>
            <label>
              Användarnamn:
              <input type="text" name="username" placeholder="Användarnamn" />
            </label>
            <label>
              Lösenord:
              <input type="password" name="password" placeholder="Lösenord" />
            </label>
            <div className={styles.actions}>
              <button type="submit">Logga in</button>
              <button type="button">Registrera dig</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
