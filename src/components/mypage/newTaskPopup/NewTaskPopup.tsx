import React, { useState } from "react";
import Styles from "./NewTaskPopup.module.css";
import { createTask } from "../../../api/api";
import type { CreateTaskDTO } from "../../../api/api";


interface NewTaskPopupProps {
  onClose: () => void;
  onTaskCreated: () => void;
}

const NewTaskPopup: React.FC<NewTaskPopupProps> = ({ onClose, onTaskCreated }) => {
  const [taskName, setTaskName] = useState("");
  const [taskStory, setTaskStory] = useState("");
  const [error, setError] = useState("");

  return (
    <div className={Styles.popup}>
      <div className={Styles.popupContent}>
        <h3>Skapa ny uppgift</h3>

        {error && <span className={Styles.error}>{error}</span>}

        <label htmlFor="taskName">Uppgiftsnamn</label>
        <input
          id="taskName"
          type="text"
          placeholder="Ex: API-integration"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <label htmlFor="taskStory">Beskrivning</label>
        <input
          id="taskStory"
          type="text"
          placeholder="Skriv en kort beskrivning av uppgiften"
          value={taskStory}
          onChange={(e) => setTaskStory(e.target.value)}
        />

        <div className={Styles.actions}>
          <button
            onClick={async () => {
              if (!taskName) {
                setError("Uppgiftsnamn obligatoriskt!");
                return;
              }
              try {
                const newTask: CreateTaskDTO = {
                  taskName: taskName,
                  taskStory: taskStory
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
