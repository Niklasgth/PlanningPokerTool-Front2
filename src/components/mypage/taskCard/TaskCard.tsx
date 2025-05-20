import React from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./TaskCard.module.css";
import type { Task } from "../../../api/api";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();


  //så vi hamnar på pokerpage med rätt id
  const handlePokerClick = () => {
    navigate(`/pokerpage/${task.id}`);
  };

  return (
    <div className={Styles.card}>
      <span>{task.taskName}</span>
      <div className={Styles.actions}>
        <button onClick={handlePokerClick}>Poker</button>
        <button>Logga tid</button>
      </div>
    </div>
  );
};

export default TaskCard;
