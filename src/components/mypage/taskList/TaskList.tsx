import React from "react";
import TaskCard from "../taskCard/TaskCard";
import Styles from "./TaskList.module.css";

interface Task {
  id: string;
  name: string;
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
        return <div>No tasks found</div>
    }

  return (
    <div className={Styles.taskList}>
      {tasks.map(task => (
        <TaskCard key={task.id} name={task.name} />
      ))}
    </div>
  );
};

export default TaskList;
