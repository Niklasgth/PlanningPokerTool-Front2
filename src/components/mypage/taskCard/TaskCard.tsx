import React from "react";
import Styles from "./TaskCard.module.css";
import type { Task } from "../../../api/api";


interface TaskCardProps {
  task: Task;
}


const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className={Styles.card}>
      <span>{task.taskName}</span>
      <div className={Styles.actions}>
        <button>Poker</button>
        <button>Logga tid</button>
      </div>
    </div>
  );
};

export default TaskCard;
