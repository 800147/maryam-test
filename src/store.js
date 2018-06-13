const store = {
  rooms: {
    "room0": {
      logs: [],
      users: {
        user0: {
          initNumber: 0,
          initName: "Алиса"
        },
        user1: {
          initNumber: 1,
          initName: "Боб"
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
    user0: {
      key: "key0",
      room: "room0"
    },
    user1: {
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
  console.log(room.logs);
  return record;
};

module.exports = { store, log };
