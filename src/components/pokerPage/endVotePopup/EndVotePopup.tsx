import React from "react";
import styles from "./EndVotePopup.module.css";

interface EndVotePopupProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const EndVotePopup: React.FC<EndVotePopupProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Avsluta omröstning?</h3>
        <p>
          Är du säker på att du vill avsluta? Detta låser omröstningen och inga fler röster kan läggas till.
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Avbryt
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Avsluta omröstningen
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndVotePopup;
