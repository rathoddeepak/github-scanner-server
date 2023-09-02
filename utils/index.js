const { GITHUB_ENDPOINT } = require("./constants");
const logger = require("./logger");
const fetch = require("node-fetch");

const githubFetch = async (token, query, variables = {}) => {
	try {
		const body = JSON.stringify({ query, variables });
		const response = await fetch(GITHUB_ENDPOINT, {
			method: "POST",
			body,
			headers: {
				"Content-Type": "application/json",
				"Authorization": `bearer ${token}`,
			},
		});
		const data = await response.json();
		if (data?.errors) {
			logger.error(data?.errors);
			return {
				success: false,
				errors: data?.errors,
			};
		}
		return { success: true, data: data.data };
	} catch (err) {
		logger.error(err);
		return { success: false };
	}
};

module.exports = {
	githubFetch,
};