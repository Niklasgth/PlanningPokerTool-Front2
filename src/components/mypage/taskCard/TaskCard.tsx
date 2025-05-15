import React from "react";
import Styles from "./TaskCard.module.css";

interface TaskCardProps {
  name: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ name }) => {
  return (
    <div className={Styles.card}>
      <span>{name}</span>
      <div className={Styles.actions}>
        <button>Poker</button>
        <button>Logga tid</button>
      </div>
    </div>
  );
};

export default TaskCard;
