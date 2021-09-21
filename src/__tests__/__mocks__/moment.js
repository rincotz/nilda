const moment = jest.requireActual("moment");

const momentMock = (timestamp = 0) => {
  return moment(timestamp);
};

Object.assign(momentMock, moment);

export default momentMock;
