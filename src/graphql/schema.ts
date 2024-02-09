import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    email: String!
    username: String!
    createdAt: String!
  }

  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    dueDate: String
    comments: [String]
    assignedUser: User
    tags: [String]
  }

  type List {
    id: ID!
    title: String!
    tasks: [Task]!
    sharedWith: [User]
  }

  type Group {
    id: ID!
    name: String!
    members: [User]!
    lists: [List]!
  }

  type Query {
    tasks: [Task]
    lists: [List]
    groups: [Group]
    users: [User]
  }

  type Mutation {
    createTask(name: String!, dueDate: String, comments: String, assignedUserId: ID, tags: [String]): Task
    createList(title: String!, taskIds: [ID]): List
    createGroup(name: String!, userIds: [ID]): Group
  }
`;
