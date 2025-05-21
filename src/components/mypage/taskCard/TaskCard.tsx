import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./TaskCard.module.css";
import type  { TaskEstimate,Task } from "../../../api/api";
import { updateTask,getTaskEstimates } from "../../../api/api";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();
  const [hasVoted, setHasVoted] = useState(false);
  const currentUserId = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!).id
  : null;

  const [durationLogged, setDurationLogged] = useState<boolean>(!!task.taskDuration);
  const [duration, setDuration] = useState<number | undefined>(task.taskDuration);
  const [inputValue, setInputValue] = useState<string>(""); // temporärt inputfält
  const [error, setError] = useState<string>("");

    useEffect(() => {
    if (!task.id || !currentUserId) return;
    getTaskEstimates()
      .then(res => {
        const estimates: TaskEstimate[] = res.data;
        setHasVoted(
          estimates.some(e => e.taskId === task.id && e.userId === currentUserId)
        );
      })
      .catch(console.error);
  }, [task.id, currentUserId]);

  // === Navigera till pokerpage med rätt task-id ===
  const handlePokerClick = () => {
    navigate(`/pokerpage/${task.id}`);
  };

  // === Skicka tid till backend ===
  const handleLogTime = async () => {
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Ange ett giltigt antal timmar > 0");
      return;
    }

    if (!task.id) return;

    try {
      const response = await updateTask(task.id, { taskDuration: parsed });
      setDuration(parsed);
      setDurationLogged(true);
      setError("");
    } catch (err) {
      setError("Något gick fel vid sparande");
      console.error("Loggning misslyckades:", err);
    }
  };

  return (
    <div className={Styles.card}>
      <span>{task.taskName}</span>
      <div className={Styles.actions}>
        {/* <button onClick={handlePokerClick}>Poker</button> */}
        <button
          onClick={handlePokerClick}
          disabled={hasVoted}
          >
          {hasVoted ? "🔒 Låst" : "Poker"}
        </button>

        {durationLogged ? (
          <span className={Styles.loggedTime}>⏱ {duration} h loggat</span>
        ) : (
          <>
            <input
              type="number"
              min={0.1}
              step={0.1}
              placeholder="Tid (h)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={Styles.input}
            />
            <button onClick={handleLogTime}>Logga tid</button>
            {error && <div className={Styles.error}>{error}</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
