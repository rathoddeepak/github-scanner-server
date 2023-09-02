const getUserRepos = `query { 
  viewer { 
    repositories (first: $limit, before:$offsetCursor) {
      pageInfo {
        endCursor
      }
      nodes {
        id
        name
        diskUsage
        owner {
          id
          login
        }
      }
    }
  }
}
`;

const getYMLFiles = `query RepoFiles($owner: String!, $name: String!) {
	repository(owner: $owner, name: $name) {
		object(expression: "master:.github/workflows/") {
		  ... on Blob {
		    byteSize
		    text
		    isBinary
		  }
		}
	}
}
`;

const getAllFiles = `query RepoFiles($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
  	id
	  name
	  diskUsage
	  owner {
		  id
			 login
		  }
	  }
    object(expression: "HEAD:") {      
      ... on Tree {
        entries {
          name
          type
          object {
            ... on Blob {
              byteSize
            }

            # One level down.
            ... on Tree {
              entries {
                name
                type
                object {
                  ... on Blob {
                    byteSize
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

