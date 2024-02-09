import AWS from 'aws-sdk';

AWS.config.update({
  region: "us-west-2"
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const UserTableName = process.env.USER_TABLE_NAME || "Users";

export const User = {
  create: async (email: string, hashedPassword: string, username: string) => {
    const params = {
      TableName: UserTableName,
      Item: {
        email,
        password: hashedPassword,
        username,
        createdAt: new Date().toISOString(),
      },
    };
    await dynamoDB.put(params).promise();
  },

  findOneByEmail: async (email: string) => {
    const params = {
      TableName: UserTableName,
      Key: {
        email,
      },
    };
    const result = await dynamoDB.get(params).promise();
    return result.Item;
  }
};
