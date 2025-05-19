import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PokerPage.module.css";

// Hårdkodad lista av deltagare
const participants = ["Anna", "Erik", "Lisa"];

const PokerPage: React.FC = () => {
  const navigate = useNavigate();

  // Sparar varje deltagares angivna tid, tomt fält eller "pass"
  const [times, setTimes] = useState<{ [name: string]: number | "" | "pass" }>({});

  // Markerar vilka deltagare som har låst sina röster
  const [locked, setLocked] = useState<{ [name: string]: boolean }>({});

  // Visar felmeddelanden för ogiltig input per användare
  const [errors, setErrors] = useState<{ [name: string]: string }>({});

  // Uppdaterar tiden som skrivs in i inputfältet
  const handleChange = (name: string, value: string) => {
    if (locked[name]) return;
    const num = parseInt(value);
    setTimes((prev) => ({
      ...prev,
      [name]: isNaN(num) ? "" : num,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Nollställ fel vid ändring
  };

  // Hanterar rösta-knappen och låser in användarens röst
  const handleLockVote = (name: string) => {
    const value = times[name];
    if (value === "" || value === undefined) {
      setErrors((prev) => ({ ...prev, [name]: "Du måste ange ett värde eller välja Pass." }));
      return;
    }
    if (value !== "pass") {
      setLocked((prev) => ({ ...prev, [name]: true }));
    }
  };

  // Hanterar "Pass"-knappen (avstår från röst)
  const handlePass = (name: string) => {
    setTimes((prev) => ({ ...prev, [name]: "pass" }));
    setLocked((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Startar om omröstningen helt
  const handleReset = () => {
    setTimes({});
    setLocked({});
    setErrors({});
  };

  // Navigerar till /mypage men borde spara ner statistiken och sedan navigera dit
  const handleEndVoting = () => {
    navigate("/mypage");
  };

  // KOllar så alla röster är en siffra
  const values = Object.values(times).filter((v): v is number => typeof v === "number");

  // Statistikberäkningar
  const average = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : "-";
  const max = values.length > 0 ? Math.max(...values) : "-";
  const min = values.length > 0 ? Math.min(...values) : "-";

  // Typvärde (vanligast förekommande rösten)
  const mode = values.length > 0 ? (() => {
    const frequency: Record<number, number> = {};
    values.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency)
      .filter(key => frequency[+key] === maxFreq)
      .map(Number);
    return modes.join(", ");
  })() : "-";

  // Medianberäkning
  const median = values.length > 0 ? (() => {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
      : sorted[mid];
  })() : "-";

  // Kollar om alla deltagare har röstat eller passat
  const allVoted = participants.every(name => locked[name]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Timepooker – Tidsuppskattning</h2>
      <p className={styles.description}>
        Sätt din uppskattning i timmar. Klicka "Rösta" för att låsa in, eller "Pass" om du inte kan ta ställning.
      </p>

      {/* Lista med deltagare */}
      <div className={styles.participantList}>
        {participants.map((name) => (
          <div key={name} className={styles.participantRow}>
            <div className={styles.inputGroup}>
              <span className={styles.participantName}>{name}</span>
              <input
                type="number"
                className={styles.input}
                placeholder="timmar"
                value={times[name] === "pass" ? "" : times[name] ?? ""}
                min={0}
                max={40}
                onChange={(e) => handleChange(name, e.target.value)}
                disabled={locked[name]}
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                className={styles.voteButton}
                onClick={() => handleLockVote(name)}
                disabled={locked[name] || times[name] === "" || times[name] === undefined || times[name] === "pass"}
              >
                {locked[name] && times[name] !== "pass" ? "🔒 Låst" : "Rösta"} 
              </button>
              <button
                className={styles.passButton}
                onClick={() => handlePass(name)}
                disabled={locked[name]}
              >
                {locked[name] && times[name] === "pass" ? "🔒 Pass" : "Pass"}
              </button>
            </div>
            {/* Felmeddelande om användaren försöker rösta utan värde inte fullt fungerande nu*/}
            {errors[name] && <div className={styles.error}>{errors[name]}</div>}
          </div>
        ))}
      </div>

      {/* Statistik visas endast när alla röstat dvs hämtar const allvoted */}
      {allVoted ? (
        <div className={styles.resultSection}>
          <p><strong>Medelvärde:</strong> {average} timmar</p>
          <p><strong>Median:</strong> {median} timmar</p>
          <p><strong>Typvärde:</strong> {mode} timmar</p>
          <p><strong>Högsta tid:</strong> {max} timmar</p>
          <p><strong>Lägsta tid:</strong> {min} timmar</p>
        </div>
      ) : (
        <div className={styles.resultSection}>
          <p><em>Väntar på att alla ska rösta eller välja pass...</em></p>
        </div>
      )}

      {/* Kontrollknappar */}
      <div className={styles.controlButtons}>
        <button className={styles.resetButton} onClick={handleReset}>
          Ny runda
        </button>
        <button className={styles.endButton} onClick={handleEndVoting}>
          Avsluta omröstning
        </button>
      </div>
    </div>
  );
};

export default PokerPage;