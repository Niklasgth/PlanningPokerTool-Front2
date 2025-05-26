import React, { useState, useEffect } from "react";
import Styles from "./MyPage.module.css";
import { TaskList, NewTaskPopup, StatisticsPanel } from ".";
import { getTasks } from "../../api/api";
import type { Task } from "../../api/api";
import LogOutButton from "../logoutbutton/LogOutButton";

const MyPage: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  //laddar in och fräshar upp tasklist. 
  const refreshTasks = async () => {
    try {
      const response = await getTasks();
      const data = Array.isArray(response.data) ? response.data : [];
      setTasks(data);
    } catch (error) {
      console.error("Kunde inte hämta tasks:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  return (
    <div className={Styles.myPageContainer}>
      <div className={Styles.main}>
        <div className={Styles.taskSection}>
                  <LogOutButton />

          <h2>Uppgifter i projektet</h2>

          <button
            className={Styles.newTaskBtn}
            onClick={() => setShowPopup(true)}
          >
            Skapa ny uppgift
          </button>

          {showPopup && (
            <NewTaskPopup
              onClose={() => setShowPopup(false)}
              onTaskCreated={refreshTasks}
            />
          )}
          <div className={Styles.taskListWrapper}>
            <TaskList tasks={tasks} />
          </div>
          {/* <TaskList tasks={tasks} /> */}
        </div>

        <div className={Styles.statisticsSection}>
          <StatisticsPanel tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
