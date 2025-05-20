
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PokerPage.module.css";
import { calculatePokerStats } from "../../utils/statUtil";
import { getTaskById, createTaskEstimate } from "../../api/api";
import type { Task } from "../../api/api";
import { getUsers } from "../../api/api";
import type { User } from "../../api/api";


const PokerPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [participants, setParticipants] = useState<User[]>([]);

  // === Task-data (namn, story etc) ===
  const [task, setTask] = useState<Task | null>(null);
  const [loadingTask, setLoadingTask] = useState(true);

  // === Hämtar inloggad användare från localStorage ===
  const [user, setUser] = useState<{ id: string; userName: string } | null>(null);

  // === Sparar varje deltagares angivna tid, tomt fält eller "pass" ===
  const [times, setTimes] = useState<{ [name: string]: number | "pass" }>({});

  // === Markerar vilka deltagare som har låst sina röster ===
  const [locked, setLocked] = useState<{ [name: string]: boolean }>({});

  // === Visar felmeddelanden för ogiltig input per användare ===
  const [errors, setErrors] = useState<{ [name: string]: string }>({});

  //TODO
  // user can actually vote -> connect with backend DONE
  // handle pass button -> send som 0 to backend DONE
  // lock pass button after user has voted
  // user can only vote once

  // === Hämta task från backend ===
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
        setLoadingTask(false);
      }
    };

    fetchTask();
  }, [id]);

   useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await getUsers();
        let fetched = response.data;

        // 🔧 ensure current user is included
        const exists = fetched.some(p => p.userName === user?.userName);
        if (!exists && user) {
          fetched = [
            ...fetched,
            { id: user.id, userName: user.userName, userPassword: "" }
          ];
        }
        setParticipants(fetched);
      } catch (error) {
        console.error("Kunde inte hämta användare:", error);
      }
    };
    if (user) fetchParticipants();
  }, [user]);
const votedCount = participants.filter(p => locked[p.userName]).length;
const notVotedCount = participants.length - votedCount;



  // === Kolla om användaren är inloggad, annars redirect ===
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
  const handleChange = (name: string, value: string) => {
    if (locked[name]) return;

    const num = parseInt(value);
    if (isNaN(num)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Ange ett heltal eller välj Pass.",
      }));
      return;
    }

    setTimes((prev) => ({ ...prev, [name]: num }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // === När användaren klickar "Rösta" (skickar in TaskEstimate) ===
  const handleSubmit = async (estDurationHours: number | "pass") => {
    if (!user || !task) return;

    const estimatedValue = estDurationHours === "pass" ? 0 : estDurationHours;
    try {
      await createTaskEstimate({
        taskId: task.id ?? "",
        userId: user.id,
        estDurationHours: estimatedValue,
      });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [participantName]: "Kunde inte spara röst.",
      }));
    }
  }

  // === När användaren klickar "Rösta" (låser sin uppskattning) ===
  const handleLockVote = async (name: string) => {
    const value = times[name];
    if (value === undefined) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Du måste ange ett värde eller välja Pass.",
      }));
      return;
    }
    // If you already voted, you can't vote again.

    if (locked[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Du kan inte rösta igen.",
      }))
      return;
    }

    // Call the API to save the vote
    await handleSubmit(value);

    setLocked((prev) => ({
      ...prev,
      [name]: true,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // === När användaren klickar "Pass" (avstår att rösta) ===
  const handlePass = async (name: string) => {
    await handleSubmit("pass");
    setTimes((prev) => ({ ...prev, [name]: "pass" }));
    setLocked((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // === Startar om rundan – rensar allt ===
  const handleReset = () => {
    setTimes({});
    setLocked({});
    setErrors({});
  };

  // === Navigerar till /mypage (kan senare användas för att spara data) ===
  const handleEndVoting = () => {
    if (!locked[participantName]) {
      setErrors((prev) => ({
        ...prev,
        [participantName]: "Du måste rösta eller välja pass innan du kan avsluta.",
      }));
      return;
    }
    navigate("/mypage");
  };

  const participantName = user?.userName || "Okänd";
  const allVoted = !!locked[participantName];

  // === Statistikberäkning ===
  const values = Object.values(times).filter((v): v is number => typeof v === "number");
  const { average, median, stdDev } = calculatePokerStats(values);

  // === Render ===
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {loadingTask ? "Laddar..." : `Timepooker – ${task?.taskName || "Okänd uppgift"}`}
      </h2>
      <p className={styles.description}>
        Inloggad som: <strong>{participantName}</strong>

        {locked[participantName] && times[participantName] !== "pass" && (
          <p style={{ color: "green" }}>✅ Din röst är sparad!</p>
        )}

      </p>
        {locked[participantName] && times[participantName] !== "pass" && (
          <h3 style={{ color: "green" }}>✅ Din röst är sparad!</h3>
        )}
      {/* {task?.taskStory && (
        <p className={styles.story}><em>{task.taskStory}</em></p>
      )} */}

      {/* === Inputfält och knappar för användaren === */}
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
              className={styles.voteButton}
              onClick={() => handlePass(participantName)}
              disabled={locked[participantName] || times[participantName] !== undefined}
            >
              {locked[participantName] || times[participantName] === "pass" ? "🔒 Låst" : "Pass"}
            </button>

          </div>

          {errors[participantName] && <div className={styles.error}>{errors[participantName]}</div>}

        </div>
      </div>
      {/* === Resultatruta – visas när användaren har röstat === */}
      {allVoted ? (
        <div className={styles.resultSection}>
          <p><strong>Medelvärde:</strong> {average} timmar</p>
          <p><strong>Median:</strong> {median} timmar</p>
          <p><strong>Standardavvikelse:</strong> {typeof stdDev === "number" ? stdDev.toFixed(2) : stdDev} timmar</p>
          {participants.length > 0 && (
          <div className={styles.voteStatus}>
            <p><strong>Röstat:</strong> {votedCount} av {participants.length}</p>
            <p><strong>Återstår:</strong> {notVotedCount}</p>
          </div>
        )}

        </div>
      ) : (
        <div className={styles.resultSection}>
          <p><em>Väntar på att du röstar eller väljer pass...</em></p>
        </div>
      )}

      {/* === Kontrollknappar === */}
      <div className={styles.controlButtons}>
        <button className={styles.resetButton} onClick={handleReset}>Ny runda</button>
        <button className={styles.endButton} onClick={handleEndVoting}>Avsluta omröstning</button>
      </div>
    </div>
  );
};

export default PokerPage;
