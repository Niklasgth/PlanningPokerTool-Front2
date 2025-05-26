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

const getSpreadLabel = (std: number) => {
  if (std === 0) return "🟢 Ingen variation";
  if (std < 1) return "🟢 Låg variation";
  if (std < 3) return "🟡 Måttlig variation";
  return "🔴 Hög variation";
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
                <li>Avslutade uppgifter: {allStats.totalCompletedTasks} av {allStats.totalTasks}</li>
                <li>Genomsnittlig faktisk tid uppgifter tagit: {allStats.avgActualDuration.toFixed(2)} timmar</li>
                <li>Genomsnittlig uppskattad tid per uppgift: {allStats.avgEstimateValue.toFixed(2)} timmar</li>
                <li>Precision (uppskattad tid vs tid det faktiskt tog): {(allStats.avgAccuracy * 100).toFixed(0)}%</li>
                <li>Antal röster per uppgift (snitt): {allStats.avgEstimateCount.toFixed(2)}</li>
              </ul>

            </div>

          ) : selectedTaskId && taskStats ? (
            <div>
              <h4>{tasks.find(t => t.id === selectedTaskId)?.taskName}</h4>
             <ul>
                <li>Antal giltiga röster: {taskStats.totalEstimates}</li>
                <li>Genomsnittlig gissad tid på uppgift: {taskStats.averageEstimate.toFixed(2)} timmar</li>
                <li>Medianvärde gissad tid på uppgift: {taskStats.median.toFixed(2)} timmar</li>

                <hr className={Styles.divider} />
                <li>
                  Spridning bland gissningarna: {taskStats.stdDeviation.toFixed(2)} timmar – {getSpreadLabel(taskStats.stdDeviation)}
                </li>

                <li>Majoriteten av gissningarna låg mellan: {Math.max(0, (taskStats.averageEstimate - taskStats.stdDeviation)).toFixed(1)} – {(taskStats.averageEstimate + taskStats.stdDeviation).toFixed(1)} timmar</li>
                <li>{
                  (() => {
                    const diff = taskStats.averageEstimate - taskStats.median;
                    if (Math.abs(diff) < 0.5) return "Snitt och median på gissningarna ligger nära varandra";
                    if (diff > 0.5) return "Snittet påverkas av höga gissningar";
                    return "Snittet påverkas av låga gissningar";
                  })()
                }</li>
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
