import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./TaskCard.module.css";
import type { Task } from "../../../api/api";
import { updateTask } from "../../../api/api";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const currentUserId = userStr ? JSON.parse(userStr).id : null;

  const isAssigned = currentUserId && Array.isArray(task.assignedUsers)
    ? task.assignedUsers.some((user) => user.id === currentUserId)
    : false;

  const [durationLogged, setDurationLogged] = useState<boolean>(!!task.taskDuration);
  const [duration, setDuration] = useState<number | undefined>(task.taskDuration);
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handlePokerClick = () => {
    navigate(`/pokerpage/${task.id}`);
  };

  const handleLogTime = async () => {
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed) || parsed <= 0) {
      setError("Ange ett giltigt antal timmar > 0");
      return;
    }

    if (!task.id) return;

    try {
      await updateTask(task.id, { taskDuration: parsed });
      setDuration(parsed);
      setDurationLogged(true);
      setError("");
    } catch (err) {
      setError("Något gick fel vid sparande");
      console.error("Loggning misslyckades:", err);
    }
  };

  const handleAddUser = (taskId: string) => {
    navigate(`/assign-users/${taskId}`);
  };

  return (
    <div className={Styles.card}>
      <span>{task.taskName}</span>
      <div className={Styles.actions}>
        <button onClick={() => task.id && handleAddUser(task.id)}>Lägg till användare</button>

        <button
          onClick={handlePokerClick}
          disabled={!isAssigned}
          title={!isAssigned ? "Du är inte tilldelad denna task" : "Gå till Poker"}
        >
          {!isAssigned ? "🚫 Ej tilldelad" : "Poker"}
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
