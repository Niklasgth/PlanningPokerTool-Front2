import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/api';
import styles from './LoginPage.module.css';

// LoginPage-sidan/komponenten vilken hanterar vår användarinlogg
const LoginPage: React.FC = () => {
  // Lokalt state för användarnamn, lösenord och eventuellt felmeddelande
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Navigeringsfunktion från react-router

  // Funktion som körs när vi sänder vårt login formulär
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Hindra sida från att laddas om

    try {
      // Anropa backend-API för att logga in användaren
      const response = await loginUser({
        userName: username,
        userPassword: password,
      });

      console.log('Login success:', response.data);
      // Navigera vidare till användarens dashboard (mypage)
      navigate('/mypage');
    } catch (err: any) {
      // Visa felmeddelande om inloggningen misslyckas
      console.error('Login failed:', err);
      setError('Fel användarnamn eller lösenord');
    }
  };

  return (
    <div className={styles.fullScreenBackground}>
      <div className={styles.loginWrapper}>
        <h1 className={styles.loginHeader}>Welcome to Poker Game</h1>
        <div className={styles.loginBox}>
          <h2 className={styles.formTitle}>Logga in</h2>

          {/* Formulär för inloggning */}
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <label>
              Användarnamn:
              <input
                type="text"
                name="username"
                placeholder="Användarnamn"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label>
              Lösenord:
              <input
                type="password"
                name="password"
                placeholder="Lösenord"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {/* Visar felmeddelande om inloggning misslyckas */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className={styles.actions}>
              {/* Knapp för att skicka inloggningsformuläret */}
              <button type="submit">Logga in</button>

              {/* Knapp för att navigera till registreringssidan */}
              <button type="button" onClick={() => navigate('/register')}>
                Registrera dig
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;