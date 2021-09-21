// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
/*import * as admin from "firebase-admin";
import serviceAccount from "../../nilda-test-firebase-adminsdk-2i2ur-615ef159cb.json";*/

Enzyme.configure({ adapter: new Adapter() });
/*

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nilda-test.firebaseio.com",
});
*/
