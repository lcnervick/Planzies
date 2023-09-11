const OAuth2Server = require('oauth2-server');

const oauth = new OAuth2Server({
  model: require("./model_client_credentials"),
  allowBearerTokensInQueryString: true,
  accessTokenLifetime: 60 * 60
})

const obtainToken = (req, res) => {
  // Oauth calls getClient (from decoded clientId/Secret) and getUserFromClient,
  // Creates a token object that looks like:
  // {
  //   accessToken: 'fb7df06afe792183d341b88ff7ebca2cf96c0fb0',
  //   accessTokenExpiresAt: 2023-09-11T18:00:32.499Z,
  //   scope: undefined
  // }
  // ... and finally calls saveToken with the token, client and user objects returned.
  let request = new OAuth2Server.Request(req);
  let response = new OAuth2Server.Response(res);
  
  return oauth.token(request, response)
  .then((token) => {
      res.json(token);
    })
    .catch((err) => {
      res.json(err);
    })
}

// Obtain an Access Token - Step 1;
// HTTP Authorization: Basic [base64 encoded client id/secret]
// 
// grant-type=client_credentials
app.all('/login', obtainToken);
// Server responds with access token like:
// {
//   "accessToken":" "<access token>",
//   "accessTokenExpiresAt":"2021-06-17T01:02:37.272Z",
//   "client": {
//     "id": "application-id",
//     "user":{}
//   }
// }


const authenticateRequest = (req, res, next) => {
  // pulls authorization code from the request header and gets it via the getAccessToken call
  // if all checks out, calls the next middleware
  let request = new OAuth2Server.Request(req);
  let response = new OAuth2Server.Response(res);

  return oauth.authenticate(request, response)
    .then(() => {
      next();
    })
    .catch((err) => {
      res.send("You are not allowed");
    })
}

// Get Access to Data - Step 2;
// HTTP Authorization: Bearer [authorization code from stem 1]
// 
// [requestinfo here]

app.get('/data', authenticateRequest, (req, res) => {
  res.send("You have been authenticated. Here is your data");
});