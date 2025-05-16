import React from "react";
import TaskCard from "../taskCard/TaskCard";
import Styles from "./TaskList.module.css";
import type { Task } from "../../../api/api";

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
        return <div>No tasks found</div>
    }

  return (
    <div className={Styles.taskList}>
      {Array.isArray(tasks) ? (
      tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))
    ) : (
      <p>Inga uppgifter att visa.</p>
    )}
    </div>
  );
};

export default TaskList;

