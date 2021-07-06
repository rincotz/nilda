import { stageUser } from "../../actions/signIn";
import { STAGE_USER } from "../../constants";
import { hirer } from "../../utils/fixtures";

test("should fire stageUser action object", () => {
  const action = stageUser(hirer);
  expect(action).toEqual({
    type: STAGE_USER,
    user: hirer,
  });
});
