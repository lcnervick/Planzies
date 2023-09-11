// example of what the DB needs to include for this to work
const db = {
	confidentialClients: [{
		clientId: 'application-name',
		clientSecret: 'p@ssw0rd',
		grants: [
			'client_credentials'
		],
	}],
	tokens:[]
};

// The following functions are required by the oauth module to process data
// Do not remove any of these, but they can be modified to integrate properly.

const getClient = (clientId, clientSecret) => {
	let confidentialClients = db.confidentialClients.filter((client) => {
		return client.clientId === clientId && client.clientSecret === clientSecret
	});
	return confidentialClients[0];
  }
  
const saveToken = (token, client, user) => {
	token.client = {
		id: client.clientId
	}
	token.user = {
		username: user.username
	}
	db.tokens.push(token);
	return token;
}
  
const getUserFromClient = (client) => {
	return {};
}
  
  
const getAccessToken = (accessToken) => {
	let tokens = db.tokens.filter((savedToken)=>{
		return savedToken.accessToken === accessToken;
	});
	return tokens[0];
}
  
module.exports = {
	getClient: getClient,
	saveTokens: saveTokens,
	getUserFromClient: getUserFromClient,
	getAccessToken: getAccessToken
}