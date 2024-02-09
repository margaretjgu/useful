export const resolvers = {
    Query: {
      tasks: async () => {
      },
      lists: async () => {
      },
      groups: async () => {
      },
      users: async () => {
      },
    },
    Mutation: {
      createTask: async (_, { name, dueDate, comments, assignedUserId, tags }) => {
      },
      createList: async (_, { title, taskIds }) => {
      },
      createGroup: async (_, { name, userIds }) => {
      },
    },
  };
  