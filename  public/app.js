
$(document).ready(function() {
  $.get('/profile.json').then(function(profile) {
    $.ajax({
      type: 'POST',
      url: 'https://galvanize-cors-proxy.herokuapp.com/https://watson-api-explorer.mybluemix.net/personality-insights/api/v3/profile?version=2017-02-01',
      contentType: 'application/json',
      data: JSON.stringify(profile),
      headers: {
        "Authorization": "Basic Y2RjZjZjMWEtN2Q0Yy00YzA0LWJiNmUtZTE4MmIxNDdmMzAwOkdna1dBUGNQREZhMQ=="
      }
    }).then(function(analysis) {
      console.log(analysis);
    })
  })
})
