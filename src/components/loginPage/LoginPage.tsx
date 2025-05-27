import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/api';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        userName: username,
        userPassword: password,
      });

      const { token, userId, userName } = response.data;

      localStorage.setItem("jwtToken", token);
      localStorage.setItem("user", JSON.stringify({
        id: userId,
        userName: userName
      }));

      console.log('Login success:', response.data);

      navigate('/mypage');
    } catch (err: any) {
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

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className={styles.actions}>
              <button type="submit">Logga in</button>
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
