import React, { useState } from "react";
import Styles from "./StatisticsPanel.module.css";
import { getStatsByTaskId, getAllStats, type Task, type TaskStatsDTO, type StatsDTO } from "../../../api/api";


interface TaskStatsProps {
  tasks: Task[];
}

const StatisticsPanel: React.FC<TaskStatsProps> = ({ tasks }) => {
  const [activeTab, setActiveTab] = useState<"statistik" | "vis">("statistik");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [taskStats, setTaskStats] = useState<TaskStatsDTO | null>(null);
  const [allStats, setAllStats] = useState<StatsDTO | null>(null);

  const handleTaskChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const taskId = e.target.value;
    setSelectedTaskId(taskId);
    // if 'Alla uppgifter' is selected
    if (taskId === "all") {
      const stats = await getAllStats();
      setAllStats(stats.data);
    } else {
      setAllStats(null);
    }

    // If a task is selected
    if (taskId) {
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
          <option value="all">Alla uppgifter</option>
          {Array.isArray(tasks) && tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.taskName}
            </option>
          ))}
        </select>
      </div>

      <div className={Styles.statsBox}>
        {activeTab === "statistik" ? (
          selectedTaskId === "all" && allStats ? (
            <div>
              <h4>Allmän statistik</h4>
              <ul>
                <li>Totalt antal uppgifter: {allStats.totalTasks}</li>
                <li>Antal avslutade uppgifter: {allStats.totalCompletedTasks}</li>
                <li>Genomsnittlig precision: {allStats.avgAccuracy.toFixed(2)}</li>
                <li>Genomsnittlig antal röster: {allStats.avgEstimateCount.toFixed(2)}</li>
                <li>Genomsnittlig loggad tid: {allStats.avgActualDuration.toFixed(2)}</li>
                <li>Genomsnittlig estimerad tid: {allStats.avgEstimateValue.toFixed(2)}</li>
              </ul>
            </div>

          ) : selectedTaskId && taskStats ? (
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
