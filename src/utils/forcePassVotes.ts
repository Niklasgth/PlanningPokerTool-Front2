//== En util till pokerpage omrödtningen som tvingar avslutad omröstning. Sätter alla som ej röstat till 0 vilket i tsatistiken ej tas med. 

import { getUsers, createTaskEstimate } from "../api/api";
import type { User } from "../api/api";

export const forcePassVotes = async (
  taskId: string,
  participants: string[],
  alreadyLocked: { [name: string]: boolean }
) => {
  try {
    const allUsers = (await getUsers()).data as User[];
    const userMap = Object.fromEntries(allUsers.map((u) => [u.userName, u.id]));

    const usersToPass = participants.filter((name) => !alreadyLocked[name]);

    console.log("Tvingar pass-röst för användare:", usersToPass);

    await Promise.all(
      usersToPass.map((name) => {
        const userId = userMap[name];
        if (!userId) {
          console.warn(`Ingen userId hittad för ${name}, hoppar över.`);
          return;
        }
        return createTaskEstimate({
          taskId,
          userId,
          estDurationHours: 0
        });
      })
    );
  } catch (err) {
    console.error("forcePassVotes error:", err);
    throw err;
  }
};
