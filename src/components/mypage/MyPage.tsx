import React, { useState } from "react";
import Styles from "./Dashboard.module.css";
import { TaskList, NewTaskPopup, StatisticsPanel } from ".";

const MyPage: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  const mockTasks = [
    { id: "1", name: "Uppgift 1" },
    { id: "2", name: "Uppgift 2" },
    { id: "3", name: "Uppgift 3" },
  ];

  return (
    <div className={Styles.dashboardContainer}>
      <div className={Styles.main}>
        <div className={Styles.taskSection}>
          <h2>Uppgifter i projektet</h2>

          <button
            className={Styles.newTaskBtn}
            onClick={() => setShowPopup(true)}
          >
            Skapa ny uppgift
          </button>

          {/* Visar popupen bara då showPopup = true */}
          {showPopup && <NewTaskPopup onClose={() => setShowPopup(false)} />}

          <TaskList tasks={mockTasks} />
        </div>

        <div className={Styles.statisticsSection}>
          <StatisticsPanel />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
