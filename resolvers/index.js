const githubService = require("../services/");
const RequestLock = require("../utils/requestLock");
const requestLock = new RequestLock({
  maxRequests: 2
});

const resolvers = {
  Query: {
    repositories: async (parent, args) => {
      return await githubService.getUserRepos(args);
    },
    repositoryDetails: async (parent, args) => {
      try {
        requestLock.addRequest(); // Allows only two Request at a time
        return await githubService.getRepoDetails(args);
      } catch (err) {
        throw new Error(err);
      } finally {
        requestLock.removeRequest();
      }
    },
  },
};

module.exports = resolvers;