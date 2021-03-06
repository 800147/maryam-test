const store = {
  rooms: {
    "room0": {
      logs: [],
      users: {
        "user0": {
          initNumber: 0,
          initName: "Алиса",
          id: "user0"
        },
        "user1": {
          initNumber: 1,
          initName: "Боб",
          id: "user1"
        }
      },
      observerKey: "observerKey0",
      observers: [],
      state: {
        scene: 0
      }
    }
  },
  users: {
    "user0": {
      key: "key0",
      room: "room0"
    },
    "user1": {
      key: "key1",
      room: "room0"
    }
  }
};

const log = (room, message) => {
  const record = {
    users: Object.assign({}, room.users),
    state: Object.assign({}, room.state),
    message: message,
    time: new Date()
  };
  room.logs.push(record);
  return record;
};

module.exports = { store, log };
