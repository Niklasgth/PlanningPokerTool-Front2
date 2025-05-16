import React from "react";
import TaskCard from "../taskCard/TaskCard";
import Styles from "./TaskList.module.css";
import type { Task } from "../../../api/api";

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className={Styles.taskList}>
      {tasks.map(task => (
       <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;

