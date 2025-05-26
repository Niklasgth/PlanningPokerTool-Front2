import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUsers, getTaskById, assignUsersToTask } from "../../api/api";
import type { User } from "../../api/api";

const AssignUsersPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [taskName, setTaskName] = useState<string>("");

  useEffect(() => {
    getUsers().then(res => setUsers(res.data));
    getTaskById(taskId!).then(res => {
      setTaskName(res.data.taskName);
      // === CHANGED/ADDED: Pre-select already assigned users
      setSelected(res.data.assignedUsers ? res.data.assignedUsers.map((u: User) => u.id) : []);
    });
  }, [taskId]);

  const handleToggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    await assignUsersToTask(taskId!, selected);
    navigate("/mypage");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Lägg till användare för: {taskName}</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(user.id)}
                onChange={() => handleToggle(user.id)}
              />
              {user.userName}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSave}>Spara</button>
    </div>
  );
};

export default AssignUsersPage;
