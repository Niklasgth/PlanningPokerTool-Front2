import React, { useState, useEffect } from "react";
import Styles from "./MyPage.module.css";
import { TaskList, NewTaskPopup, StatisticsPanel } from ".";
import { getTasks } from "../../api/api";
import type { Task } from "../../api/api";

const MyPage: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data);
      } catch (error) {
        console.error("Kunde inte hämta tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className={Styles.myPageContainer}>
      <div className={Styles.main}>
        <div className={Styles.taskSection}>
          <h2>Uppgifter i projektet</h2>

          <button
            className={Styles.newTaskBtn}
            onClick={() => setShowPopup(true)}
          >
            Skapa ny uppgift
          </button>

          {showPopup && <NewTaskPopup onClose={() => setShowPopup(false)} />}

          <TaskList tasks={tasks} />
        </div>

        <div className={Styles.statisticsSection}>
          <StatisticsPanel />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
