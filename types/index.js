const gql = require('graphql-tag');

const typeDefs = gql`
  type Repository {
    name: String
    size: Int
    owner: String
    isPrivate: Boolean    
  }

  type FileContent {
    path: String
    size: Int
    url: String
  }

  type Webhook {
    name: String
    events: [String]
    active: Boolean
  }

  type RepositoryDetails {
    name: String
    size: Int
    owner: String
    isPrivate: Boolean
    numFiles: Int
    ymlContent: [FileContent]
    activeWebhooks: [Webhook]
  }

  type Query {
    repositories(token: String!, limit: Int, offsetCursor: String): [Repository]
    repositoryDetails(token: String!, owner: String!, repoName: String!): RepositoryDetails
  }
`;

module.exports = typeDefs;