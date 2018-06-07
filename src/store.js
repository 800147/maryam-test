const store = {
  rooms: {
    "35725e6a-704f-4aed-bbc4-425ab305f50d": {
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
      state: {
        scene: 0
      }
    }
  },
  users: {
    user0: {
      key: "key0",
      room: "35725e6a-704f-4aed-bbc4-425ab305f50d"
    },
    user1: {
      key: "key1",
      room: "35725e6a-704f-4aed-bbc4-425ab305f50d"
    }
  }
};

module.exports = { store };
