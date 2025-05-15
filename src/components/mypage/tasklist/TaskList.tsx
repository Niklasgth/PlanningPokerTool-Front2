import React from "react";
import TaskCard from "../../mypage/taskCard/TaskCard";
import Styles from "./TaskList.module.css";

interface Task {
  id: string;
  name: string;
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className={Styles.taskList}>
      {tasks.map(task => (
        <TaskCard key={task.id} name={task.name} />
      ))}
    </div>
  );
};

export default TaskList;
