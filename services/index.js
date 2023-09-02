const utils = require('../utils');
const { Octokit, App } = require("octokit");

const validateToken = (token) => {
	if(typeof token === 'string' && token?.length > 4) {
		return
	}
	throw new Error("Valid Token is required");
};

const getUserRepos = async ({ token, limit = 100, offsetCursor = null } = {}) => {
	validateToken(token);
	const query = `query ($limit: Int, $offsetCursor: String) { 
	  viewer { 
	    repositories (first: $limit, before:$offsetCursor) {
	      pageInfo {
	        endCursor
	      }
	      nodes {
	        id
	        name
	        isPrivate
	        diskUsage
	        owner {
	          id
	          login
	        }
	      }
	    }
	  }
	}`;
	const response = await utils.githubFetch(token, query, {
		limit,
		offsetCursor
	});
	if(response?.success) {
		const data = response.data?.viewer;
		const result = (data?.repositories?.nodes || [])?.map((repo) => ({
			name: repo.name,
		    size: repo.diskUsage,
		    owner: repo.owner.login,
		    isPrivate: repo.isPrivate   
		}));
		return result;
	} else {
		throw new Error(response.message);
	}
};

const getRepoStats = async (token, params = {}, branch) => {
	const { owner = "", repoName = ""} = params;
	const endpoint = `https://api.github.com/repos/${owner}/${repoName}/git/trees/${branch}?recursive=1`;
	const response = await fetch(endpoint, {
		headers: {
	      "Content-Type": "application/json",
	      "Authorization": `bearer ${token}`,
	    }
	});	
	let numFiles = 0;
	let ymlContent = [];
	let activeWebhooks = 0;
	const result = await response.json();
	const fileTree = result?.tree || [];	
	if(fileTree){		
		fileTree.forEach((file) => {
			if(file.type === "blob"){
				numFiles += 1;

				if(file.path.endsWith('yml')) {
					ymlContent.push({
						path: file.path,
						size: file.size,
						url: file.url
					});
				}
			}
		});	
	};
	const octokit = new Octokit({
	  auth: token
	});
	const webhooks = await octokit.request('GET /repos/{owner}/{repo}/hooks', {
	  owner: owner,
	  repo: repoName,
	  headers: {
	    'X-GitHub-Api-Version': '2022-11-28'
	  }
	});
	activeWebhooks = (webhooks?.data || []).map((w) => ({
		name: w.name,
		events: w.events,
		active: w.active
	}));
	return {
		numFiles,
		ymlContent,
		activeWebhooks
	};
};

const getRepoDetails = async (params = {}) => {
	const { token, owner = "", repoName = "" } = params;
	validateToken(token);	
	if(!owner?.length && !repoName?.length) {
		throw new Error("Owner name and Repo Name is required!");
	};
	const userDetails = `query RepoFiles($owner: String!, $name: String!) {
	  repository(owner: $owner, name: $name) {
	  	id
	  	name
	  	diskUsage
	  	isPrivate
	  	owner {
		  	id
		 	login
		}
		defaultBranchRef {
    	  id
          name
    	}
	  }
	}`;

	const response = await utils.githubFetch(token, userDetails, {
		owner,
		name: repoName
	});
	
	if(response?.success) {
		const data = response.data?.repository;
		const branch = data.defaultBranchRef.name;
		const { numFiles, ymlContent, activeWebhooks } = await getRepoStats(token, params, branch);
		const result = {
			name: data.name,
		    size: data.diskUsage,
		    owner: data.owner.login,
		    isPrivate: data.isPrivate,
		    numFiles,
			ymlContent,
			activeWebhooks
		};
		return result;
	} else {
		throw new Error(response.message);
	}
};

module.exports = {
	getUserRepos,
	getRepoDetails
}

