import React from "react";
import Styles from "./NewTaskPopup.module.css";

interface NewTaskPopupProps {
  onClose: () => void;
}

const NewTaskPopup: React.FC<NewTaskPopupProps> = ({ onClose }) => {
  return (
    <div className={Styles.popup}>
      <div className={Styles.popupContent}>
        <h3>Skapa ny uppgift</h3>

        <label htmlFor="taskName">Uppgiftsnamn</label>
        <input id="taskName" type="text" placeholder="Ex: API-integration" />

        <div className={Styles.actions}>
            <button onClick={() => {console.log("Skapat ny uppgift");
                    onClose();}}
                    >Skapa</button>
          
          <button onClick={onClose}>Avbryt</button>
        </div>
      </div>
    </div>
  );
};

export default NewTaskPopup;
