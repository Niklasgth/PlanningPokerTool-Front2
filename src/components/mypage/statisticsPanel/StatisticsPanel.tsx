import React, { useState } from "react";
import Styles from "./StatisticsPanel.module.css";
import { getStatsByTaskId, type Task, type TaskStatsDTO } from "../../../api/api";


interface TaskStatsProps {
  tasks: Task[];
}

const StatisticsPanel: React.FC<TaskStatsProps> = ({ tasks }) => {
  const [activeTab, setActiveTab] = useState<"statistik" | "vis">("statistik");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [taskStats, setTaskStats] = useState<TaskStatsDTO | null>(null);

  const handleTaskChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const taskId = e.target.value;
    setSelectedTaskId(taskId);

    // Only fetch if a real task is selected
    if (taskId) {
      // Replace this with your actual API call
      const stats = await getStatsByTaskId(taskId);
      setTaskStats(stats.data);
    } else {
      setTaskStats(null);
    }
  };

  return (
    <div className={Styles.panel}>
      <div className={Styles.tabHeader}>
        <button
          className={activeTab === "statistik" ? Styles.active : ""}
          onClick={() => setActiveTab("statistik")}
        >
          Statistik
        </button>
        <button
          className={activeTab === "vis" ? Styles.active : ""}
          onClick={() => setActiveTab("vis")}
        >
          Stat vis
        </button>
      </div>

      <div className={Styles.taskDropDown}>
        {/* <label htmlFor="task-select">Dropdown</label> */}
        <select id="task-select" value={selectedTaskId} onChange={handleTaskChange}>
          <option value="">Välj uppgift</option>
          {Array.isArray(tasks) && tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.taskName}
            </option>
          ))}
        </select>
      </div>

      <div className={Styles.statsBox}>
        {activeTab === "statistik" ? (
          selectedTaskId && taskStats ? (
            <div>
              <h4>{tasks.find(t => t.id === selectedTaskId)?.taskName}</h4>
              <ul>
                <li>Antal röster: {taskStats.totalEstimates}</li>
                <li>Medelvärde: {taskStats.averageEstimate.toFixed(2)}</li>
                <li>Median: {taskStats.median.toFixed(2)}</li>
                <li>Standardavvikelse: {taskStats.stdDeviation.toFixed(2)}</li>
              </ul>
            </div>
          ) : (
            <p>Välj en uppgift för att se statistik</p>
          )
        ) : (
          <p>📊 Här visas visualisering</p>
        )}
      </div>
    </div>
  );
};

export default StatisticsPanel;
