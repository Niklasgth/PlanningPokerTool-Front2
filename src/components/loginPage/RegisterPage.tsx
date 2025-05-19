import React, { useState, useEffect } from 'react';
import styles from './LoginPage.module.css';
import {createUser, getUsers} from '../../../src/api/api';
import type { User } from '../../../src/api/api';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch all users once when the component loads
    getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setError('Kunde inte hämta användare'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if username is already taken
    const usernameExists = users.some((u) => u.userName === username);
    if (usernameExists) {
      setError('Användarnamnet är redan upptaget');
      // setSuccess to clean old success message otherwize it appear old succes messages
      setSuccess('');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte');
      setSuccess('');
      return;
    }
    // to clean old error messages
    setError('');

    const newUser: Omit<User, 'id'> = {
        //omit skipped creating id.
        userName: username,
        userPassword: password,
      };
      
    try{
        await createUser(newUser);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setSuccess('Registreringen lyckades!');
        // To auto navigate to loginPage after 2 sec.
        setTimeout(() => navigate('/'), 2000);
    } 
    catch (err) {
        setError('Något gick fel vid registreringen');
    }
  };

  return (
    <div className={styles.fullScreenBackground}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginBox}>
          <h2 className={styles.formTitle}>Registrera dig</h2>
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <label>
              Användarnamn:
              <input
                type="text"
                name="username"
                placeholder="Användarnamn"
                value={username}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <label>
              Bekräfta lösenord:
              <input
                type="password"
                name="confirmPassword"
                placeholder="Upprepa lösenord"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <div className={styles.actions}>
              <button type="submit">Registrera dig</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;