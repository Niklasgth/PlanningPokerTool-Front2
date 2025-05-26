import React, { useState } from "react";
import Styles from "./NewTaskPopup.module.css";
import { createTask } from "../../../api/api";
import type { Task } from "../../../api/api";
import LogOutButton from "../../logoutbutton/LogOutButton";


interface NewTaskPopupProps {
  onClose: () => void;
  onTaskCreated: () => void;
}

const NewTaskPopup: React.FC<NewTaskPopupProps> = ({ onClose, onTaskCreated }) => {
  const [taskName, setTaskName] = useState("");

  return (
    <div className={Styles.popup}>
      <div className={Styles.popupContent}>
        <h3>Skapa ny uppgift</h3>

        <label htmlFor="taskName">Uppgiftsnamn</label>
        <input
          id="taskName"
          type="text"
          placeholder="Ex: API-integration"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <div className={Styles.actions}>
          <button
            onClick={async () => {
              try {
                const newTask: Task = {
                  taskName: taskName,
                  taskStory: "Beskrivning här",
                  taskDuration: 0,
                  assignedUserId: "demo-user"
                };

                await createTask(newTask);
                console.log("Uppgift skapad!");

                onTaskCreated();
                onClose();
              } catch (error) {
                console.error("Fel vid skapande av uppgift:", error);
              }
            }}
          >
            Skapa
          </button>

          <button onClick={onClose}>Avbryt</button>
        </div>
      </div>
    </div>
  );
};


export default NewTaskPopup;
