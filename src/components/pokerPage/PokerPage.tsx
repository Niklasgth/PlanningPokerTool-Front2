import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PokerPage.module.css";
import { calculatePokerStats } from "../../utils/statUtil";
import { getTaskById } from "../../api/api";
import type { Task } from "../../api/api";

// === Deltagare (kan bytas mot dynamisk användarlista) ===
const participants = ["Anna", "Erik", "Lisa"];

const PokerPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // === Task-data (namn, story etc) ===
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // === Sparar varje deltagares angivna tid, tomt fält eller "pass" ===
  const [times, setTimes] = useState<{ [name: string]: number | "pass" }>({});

  // === Markerar vilka deltagare som har låst sina röster ===
  const [locked, setLocked] = useState<{ [name: string]: boolean }>({});

  // === Visar felmeddelanden för ogiltig input per användare ===
  const [errors, setErrors] = useState<{ [name: string]: string }>({});

  // === Hämta task från backend med task-id från URL ===
  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (id) {
          const response = await getTaskById(id);
          setTask(response.data);
        }
      } catch (error) {
        console.error("Kunde inte hämta task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

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

  // === När användaren klickar "Rösta" (låser sin uppskattning) todo ta in inputfält för skapa en taskestimate ===
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

  // === Hämtar alla inskickade nummer-värden (filtrerar bort "pass") ===
  const values = Object.values(times).filter((v): v is number => typeof v === "number");

  // === Beräknar statistikmått utifrån rösterna ===
  const { average, median, stdDev } = calculatePokerStats(values);

  // === Kollar om alla deltagare har låst sina svar ===
  const allVoted = participants.every((name) => locked[name]);

  // === Render ===
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {/* todo skriva ut taskname för task */}
        {loading ? "Laddar..." : `Timepooker – ${task?.taskName || "Okänd uppgift"}`}
      </h2>
      <p className={styles.description}>
        Sätt din uppskattning i timmar. Klicka "Rösta" för att låsa in, eller "Pass" om du inte kan ta ställning.
      </p>

      {/* === Inputfält och knappar för varje deltagare === */}
      <div className={styles.participantList}>
        {participants.map((name) => (
          <div key={name} className={styles.participantRow}>
            <div className={styles.inputGroup}>
              <span className={styles.participantName}>{name}</span>
              <input
                type="number"
                className={styles.input}
                placeholder="timmar"
                value={typeof times[name] === "number" ? times[name] : ""}
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
                disabled={locked[name] || times[name] === "pass" || times[name] === undefined}
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
            {errors[name] && <div className={styles.error}>{errors[name]}</div>}
          </div>
        ))}
      </div>

      {/* === Resultatruta – visas när alla röstat === */}
      {allVoted ? (
        <div className={styles.resultSection}>
          <p><strong>Medelvärde:</strong> {average} timmar</p>
          <p><strong>Median:</strong> {median} timmar</p>
          <p><strong>Standardavvikelse:</strong> {typeof stdDev === "number" ? stdDev.toFixed(2) : stdDev} timmar</p>
        </div>
      ) : (
        <div className={styles.resultSection}>
          <p><em>Väntar på att alla ska rösta eller välja pass...</em></p>
        </div>
      )}

      {/* === Kontrollknappar === */}
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
