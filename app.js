var watson = require('watson-developer-cloud');
var personality_insights = watson.personality_insights({
  username: '{cdcf6c1a-7d4c-4c04-bb6e-e182b147f300}',
  password: '{GgkWAPcPDFa1}',
  version: 'v2'
});

var params = require('profile.json');
personality_insights.profile(params, function(error, response) {
  if (error)
    console.log('error:', error);
  else
    console.log(JSON.stringify(response, null, 2));
  }
);
