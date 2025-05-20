import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PokerPage.module.css";
import { calculatePokerStats } from "../../utils/statUtil";

// === Deltagare (kan bytas mot dynamisk användarlista) ===
// const participants = ["Anna", "Erik", "Lisa"];


const PokerPage: React.FC = () => {
  const navigate = useNavigate();

  // === Sparar varje deltagares angivna tid, tomt fält eller "pass" ===
  const [times, setTimes] = useState<{ [name: string]: number | "pass" }>({});

  // === Markerar vilka deltagare som har låst sina röster ===
  const [locked, setLocked] = useState<{ [name: string]: boolean }>({});

  // === Visar felmeddelanden för ogiltig input per användare ===
  const [errors, setErrors] = useState<{ [name: string]: string }>({});

  const [user, setUser] = useState<{ id: string; userName: string } | null>(null);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const parsed = JSON.parse(storedUser);
    setUser(parsed);
  } else {
    navigate("/");
  }
}, [navigate]);


  // === Uppdaterar tiden som skrivs in i inputfältet ===
  //tar emot deltagarnamn (senare mot user) samt dess input
  const handleChange = (name: string, value: string) => {
    //om deltagare låst svar sker inget
    if (locked[name]) return;

    //omvandlar om möjligt string inmatningen till heltal (number)
    const num = parseInt(value);

    //nan betyder not a number (boolean kontroll för ogiltlig input)
    if (isNaN(num)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Ange ett heltal eller välj Pass.",
      }));
      return;
    }
    //sparar ner det giltliga värdet
    setTimes((prev) => ({
      ...prev,
      [name]: num,
    }));
//tar bort eventuella tidigare felmedelanden
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // === När användaren klickar "Rösta" (låser sin uppskattning) ===
  const handleLockVote = (name: string) => {
    const value = times[name];
    if (value === undefined) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Du måste ange ett värde eller välja Pass.",
      }));
      return;
    }

    if (value !== "pass") {
      setLocked((prev) => ({
        ...prev,
        [name]: true,
      }));
    }
  };

  // === När användaren klickar "Pass" (avstår att rösta) ===
  const handlePass = (name: string) => {
    setTimes((prev) => ({
      ...prev,
      [name]: "pass",
    }));

    setLocked((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // === Startar om rundan – rensar allt ===
  const handleReset = () => {
    setTimes({});
    setLocked({});
    setErrors({});
  };

  // === Navigerar till /mypage (kan senare användas för att spara data) ===
  const handleEndVoting = () => {
    navigate("/mypage");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // === Hämtar alla inskickade nummer-värden (filtrerar bort "pass") ===
  const values = Object.values(times).filter((v): v is number => typeof v === "number");

  // === Beräknar statistikmått utifrån rösterna ===
  const { average, median, mode, max, min, stdDev } = calculatePokerStats(values);

  const participantName = user?.userName || "Okänd";

  // === Kollar om alla deltagare har låst sina svar ===
  const allVoted = !!locked[participantName];

  // === Render ===
return (
    <div className={styles.container}>
      <h2 className={styles.title}>Timepooker – Tidsuppskattning</h2>
      <p className={styles.description}>
        Inloggad som: <strong>{participantName}</strong>
      </p>

      <div className={styles.participantList}>
        <div className={styles.participantRow}>
          <div className={styles.inputGroup}>
            <span className={styles.participantName}>{participantName}</span>
            <input
              type="number"
              className={styles.input}
              placeholder="timmar"
              value={typeof times[participantName] === "number" ? times[participantName] : ""}
              min={0}
              max={40}
              onChange={(e) => handleChange(participantName, e.target.value)}
              disabled={locked[participantName]}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.voteButton}
              onClick={() => handleLockVote(participantName)}
              disabled={locked[participantName] || times[participantName] === "pass" || times[participantName] === undefined}
            >
              {locked[participantName] && times[participantName] !== "pass" ? "🔒 Låst" : "Rösta"}
            </button>
            <button
              className={styles.passButton}
              onClick={() => handlePass(participantName)}
              disabled={locked[participantName]}
            >
              {locked[participantName] && times[participantName] === "pass" ? "🔒 Pass" : "Pass"}
            </button>
          </div>
          {errors[participantName] && <div className={styles.error}>{errors[participantName]}</div>}
        </div>
      </div>

      {allVoted ? (
        <div className={styles.resultSection}>
          <p><strong>Medelvärde:</strong> {average} timmar</p>
          <p><strong>Median:</strong> {median} timmar</p>
          <p><strong>Typvärde:</strong> {mode} timmar</p>
          <p><strong>Högsta tid:</strong> {max} timmar</p>
          <p><strong>Lägsta tid:</strong> {min} timmar</p>
          <p><strong>Standardavvikelse:</strong> {typeof stdDev === "number" ? stdDev.toFixed(2) : stdDev} timmar</p>
        </div>
      ) : (
        <div className={styles.resultSection}>
          <p><em>Väntar på att du röstar eller väljer pass...</em></p>
        </div>
      )}

      <div className={styles.controlButtons}>
        <button className={styles.resetButton} onClick={handleReset}>
          Ny runda
        </button>
        <button className={styles.endButton} onClick={handleEndVoting}>
          Avsluta omröstning
        </button>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logga ut
        </button>
      </div>
    </div>
  );
};

export default PokerPage;