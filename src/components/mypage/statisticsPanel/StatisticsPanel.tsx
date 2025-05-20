import React, { useState } from "react";
import Styles from "./StatisticsPanel.module.css";
import LogOutButton from "../../logoutbutton/LogOutButton";
const StatisticsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"statistik" | "vis">("vis");

  return (
    <div className={Styles.panel}>
      <div className={Styles.tabHeader}>
        <LogOutButton />

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

      <label htmlFor="task-select">Dropdown val av uppgift</label>
      <select id="task-select">
        <option>Vilken uppgift</option>
        <option>Uppgift 1</option>
        <option>Uppgift 2</option>
      </select>

      <div className={Styles.statsBox}>
        {activeTab === "statistik" ? (
          <p>🧮 Här visas grundläggande statistik</p>
        ) : (
          <p>📊 Här visas visualisering</p>
        )}
      </div>
    </div>
  );
};

export default StatisticsPanel;
