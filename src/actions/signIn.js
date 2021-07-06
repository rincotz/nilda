import { STAGE_USER } from "../constants";

export const stageUser = (user) => ({
  type: STAGE_USER,
  user,
});
