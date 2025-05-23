import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PokerPage.module.css";
import { getTaskById, getUsers, getTaskEstimates, createTaskEstimate, getStatsByTaskId } from "../../api/api";
import type { Task, User, TaskEstimate, TaskStatsDTO } from "../../api/api";

const PokerPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // === Task-data (namn, story etc) ===
  const [task, setTask] = useState<Task | null>(null);
  const [loadingTask, setLoadingTask] = useState(true);

  // === Hämtar inloggad användare från localStorage ===
  const [user, setUser] = useState<{ id: string; userName: string } | null>(null);

  // === Deltagare hämtade från backend ===
  const [participants, setParticipants] = useState<string[]>([]);

  // === Sparar varje deltagares angivna tid, tomt fält eller "pass" ===
  const [times, setTimes] = useState<{ [name: string]: number | "pass" }>({});

  // === Markerar vilka deltagare som har låst sina röster ===
  const [locked, setLocked] = useState<{ [name: string]: boolean }>({});

  // === Visar felmeddelanden för ogiltig input per användare ===
  const [errors, setErrors] = useState<{ [name: string]: string }>({});

  // === Backend-baserad statistik (medelvärde, median, stdDev etc) ===
  const [taskStats, setTaskStats] = useState<TaskStatsDTO | null>(null);

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

  // === Hämta användarlista från backend ===
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        const usernames = res.data.map((u: User) => u.userName);
        setParticipants(usernames);
      } catch (error) {
        console.error("Kunde inte hämta användare:", error);
      }
    };
    fetchUsers();
  }, []);

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

  // === Hämta tidigare estimates + statistik från backend ===
  useEffect(() => {
    const fetchEstimatesAndStats = async () => {
      if (!id || !user) return;
      try {
        const [estimatesRes, statsRes] = await Promise.all([
          getTaskEstimates(),
          getStatsByTaskId(id)
        ]);

        const allEstimates: TaskEstimate[] = estimatesRes.data;
        const stats: TaskStatsDTO = statsRes.data;

        // Lås röstande för användare om de redan röstat
        const alreadyVoted = allEstimates.find(
          (e) => e.taskId === id && e.userId === user.id
        );
        if (alreadyVoted) {
          setTimes((prev) => ({ ...prev, [user.userName]: alreadyVoted.estDurationHours || "pass" }));
          setLocked((prev) => ({ ...prev, [user.userName]: true }));
        }

        // Statistik från backend
        setTaskStats(stats);
      } catch (err) {
        console.error("Fel vid hämtning av estimates/statistik:", err);
      }
    };
    fetchEstimatesAndStats();
  }, [id, user]);

  // === Uppdaterar tiden som skrivs in i inputfältet ===
  const handleChange = (name: string, value: string) => {
    if (name !== participantName) return;
    if (locked[name]) return;
    const num = parseInt(value);
    if (isNaN(num) || num <= 0) {
      setErrors((prev) => ({ ...prev, [name]: "Du kan inte anga negativa timmar eller välj Pass." }));
      return;
    }
    setTimes((prev) => ({ ...prev, [name]: num }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // === Allmän för både "Rösta" och "Pass" ===
  const handleVote = async (name: string, value: number | "pass") => {
    if (name !== participantName || !user || !task || !task.id) return;
    if (value === undefined) {
      setErrors((prev) => ({ ...prev, [name]: "Du måste ange ett tal eller pass innan du röstar." }));
      return;
    }
    try {
      await createTaskEstimate({ taskId: task.id, userId: user.id, estDurationHours: value === "pass" ? 0 : value, });
      setTimes((prev) => ({ ...prev, [name]: value }));
      setLocked((prev) => ({ ...prev, [name]: true }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: "Kunde inte spara röst." }));
    }
  };

  // === När användaren klickar "Rösta" (låser sin uppskattning) ===
  // const handleLockVote = async (name: string) => {
  //   if (name !== participantName || !user || !task || !task.id) return;
  //   const value = times[name];
  //   if (value === undefined || typeof value !== "number") {
  //     setErrors((prev) => ({ ...prev, [name]: "Du måste ange ett värde eller välja Pass." }));
  //     return;
  //   }
  //   try {
  //     await createTaskEstimate({ taskId: task.id, userId: user.id, estDurationHours: value });
  //     setLocked((prev) => ({ ...prev, [name]: true }));
  //     setErrors((prev) => ({ ...prev, [name]: "" }));
  //   } catch (err) {
  //     setErrors((prev) => ({ ...prev, [name]: "Kunde inte spara röst." }));
  //   }
  // };

  // === När användaren klickar "Pass" (avstår att rösta) ===
  // const handlePass = async (name: string) => {
  //   if (name !== participantName || !user || !task || !task.id) return;
  //   try {
  //     await createTaskEstimate({ taskId: task.id, userId: user.id, estDurationHours: 0 });
  //     setTimes((prev) => ({ ...prev, [name]: "pass" }));
  //     setLocked((prev) => ({ ...prev, [name]: true }));
  //     setErrors((prev) => ({ ...prev, [name]: "" }));
  //   } catch (err) {
  //     setErrors((prev) => ({ ...prev, [name]: "Kunde inte spara pass." }));
  //   }
  // };


  const handleLeave = () =>
    navigate("/mypage");

  const participantName = user?.userName || "Okänd";
  const allVoted = participants.length > 0 && participants.every((name) => locked[name]);
  const votedCount = Object.values(locked).filter(Boolean).length;
  const remaining = participants.filter((name) => !locked[name]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {loadingTask ? "Laddar..." : `Timepoker – ${task?.taskName || "Okänd uppgift"}`}
      </h2>
      <p className={styles.description}>
        Inloggad som: <strong>{participantName}</strong>
      </p>

      {/* === Info om röster === */}
      <div className={styles.voteInfo}>
        <p><strong>{votedCount}/{participants.length}</strong> deltagare har röstat.</p>
        {remaining.length > 0 && (
          <p>Väntar på: {remaining.join(", ")}</p>
        )}
          {errors[participantName] && (
        <div className={styles.error}>{errors[participantName]}</div>
        )} <br />
      </div>

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
                min={1}
                max={40}
                onChange={(e) => handleChange(name, e.target.value)}
                disabled={locked[name] || name !== participantName}
              />
            </div>
            <div className={styles.buttonGroup}>
              <button
                className={styles.voteButton}
                onClick={() => handleVote(name, times[name])}
                disabled={locked[name] || times[name] === "pass" || name !== participantName}
              >
                {locked[name] || times[name] == "pass" ? "🔒 Låst" : "Rösta"}
              </button>
              <button
                className={styles.voteButton}
                onClick={() => handleVote(name, "pass")}
                disabled={locked[name] || name !== participantName}
              >
                {locked[name] || times[name] === "pass" ? "🔒 Pass" : "Pass"}
              </button>
            </div>
            {/* {errors[name] && <div className={styles.error}>{errors[name]}</div>} */}
          </div>
        ))}
      </div>

      {/* === Resultatruta – visas när alla röstat === */}
      {allVoted && taskStats ? (
        <div className={styles.resultSection}>
          <p><strong>Medelvärde:</strong> {taskStats.averageEstimate.toFixed(2)} timmar</p>
          <p><strong>Median:</strong> {taskStats.median.toFixed(2)} timmar</p>
          <p><strong>Standardavvikelse:</strong> {taskStats.stdDeviation.toFixed(2)} timmar</p>
        </div>
      ) : null}

      {/* === Lämna omröstningen === */}
      <div className={styles.controlButtons}>
        <button className={styles.endButton} onClick={handleLeave}>Lämna omröstningen</button>
      </div>
    </div>
  );
};

export default PokerPage;