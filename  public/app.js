var $submit = $('#submitBttn');
var $inputSocialMedia = $('#inputSocialMedia');
var $textInput = $('#inputText');
var tweetObj = {
  content: '',
  contenttype: "text/plain",
  created: '',
  id: '',
  language: "en",
  sourceid: "Twitter API",
  userid: ''
};
var userName;
var socialMediaData = {};
var tweetArr = [];


$submit.click(function(evt) {
  evt.preventDefault();
  if($inputSocialMedia.val()){
   var domain = 'https://galvanize-twitter-proxy.herokuapp.com/search/tweets?q=from%3A';
   var inputData = $inputSocialMedia.val();
   var url = domain + inputData;
      $.get(url)
        .then(function(result) {
          console.log(result);
          socialMediaData.statuses = result.statuses;
          var profile = JSON.stringify({'contentItems': createDataObject(socialMediaData)});
          getAnalysis(profile)
        })
        .catch(function(reason){$('p').fadeIn(1000).delay(1000).fadeOut(1000)})
  } else {
    getTextAnalysis($textInput);
  }
})

function createDataObject(socialMediaData) {
  userName = socialMediaData.statuses[0].user['screen_name'];
  var statusesArr = socialMediaData.statuses;
  statusesArr.forEach(function(status) {
    tweetObj.content = status.text,
    tweetObj.created = '',
    tweetObj.id = status.id
    tweetObj.userid = status.user['screen_name']
    tweetArr.push(tweetObj)
  })
  return tweetArr;
}
//function for sendng a post request to Watson personality-insights API. This function gets invoked on click after the first API call
//to Tweeter is executed and returns data.
function getAnalysis(profile) {
    $.ajax({
      type: 'POST',
      url: 'https://galvanize-cors-proxy.herokuapp.com/https://watson-api-explorer.mybluemix.net/personality-insights/api/v3/profile?version=2017-02-01',
      contentType: 'application/json',
      data: profile,
      headers: {
        "Authorization": "Basic Y2RjZjZjMWEtN2Q0Yy00YzA0LWJiNmUtZTE4MmIxNDdmMzAwOkdna1dBUGNQREZhMQ=="
      }
    }).then(function(analysis) {
      var personalityData = analysis.personality;
      personalityData.forEach(category => analysisData.push(Math.round(category.percentile * 100)))
      createChart(analysisData);
      socialMediaData = {};
    })
}

function getTextAnalysis(textInput) {
  $.ajax({
    type: 'POST',
    url: 'https://galvanize-cors-proxy.herokuapp.com/https://watson-api-explorer.mybluemix.net/personality-insights/api/v3/profile?version=2017-02-01',
    contentType: 'text/plain',
    data: textInput,
    headers: {
      "Authorization": "Basic Y2RjZjZjMWEtN2Q0Yy00YzA0LWJiNmUtZTE4MmIxNDdmMzAwOkdna1dBUGNQREZhMQ=="
    }
  }).then(function(analysis) {
    var personalityData = analysis.personality;
    personalityData.forEach(category => analysisData.push(Math.round(category.percentile * 100)))
    createChart(analysisData);
  })
}

//map analysis object returned by getAnalysis function to a chart
var analysisData = [];
function createChart(analysisData) {
  console.log(analysisData);
  var $ctx = $('#personalityChart')
  var bigFiveChart = new Chart($ctx, {
    type: 'polarArea',
    data: {
      labels: [
        "Openness",
        "Conscientiousness",
        "Extraversion",
        "Agreeableness",
        "Neuroticism"
      ],
      datasets: [{
        data: analysisData,
        label: userName || 'sample',
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)'
                ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
                ],
        borderWidth: 1
        // hoverBackgroundColor: [],
      }]
    }
})

}
