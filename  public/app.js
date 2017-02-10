var $submit = $('#submitBttn');
var $inputSocialMedia = $('#inputSocialMedia');
var $textInput = $('#inputText');
var fileText;

var userName;
var socialMediaData = {};
var tweetArr = [];


//enable the user to select between inputting text or Twitter handle
$('.drop-down').on('change', function(){
  if($('option:selected').attr('id') == 'opt1') {
    $('#inputText').prop('disabled', true).css('background-color', 'grey');
    $inputSocialMedia.prop('disabled', false).css('background-color', 'white')
  } else {
    $inputSocialMedia.prop('disabled', true).css('background-color', 'grey')
    $('#inputText').prop('disabled', false).css('background-color', 'white')
  }
})

//create function to execute on submit. If sample input is twitter - it sends a
//a get request to Twitter API, and runs analysis on result, otherwise
//runs analysis on text input
$submit.click(function(evt) {
  evt.preventDefault();
  $('html, body').animate({
    scrollTop: $('#chartArea').offset().top
  }, 1000)
  $('.chartText').fadeOut(700)


  if($inputSocialMedia.val()){
   var domain = 'https://galvanize-twitter-proxy.herokuapp.com/search/tweets?q=from%3A';
   var inputData = $inputSocialMedia.val();
   var url = domain + inputData;
      $.get(url)
        .then(function(result) {
          socialMediaData.statuses = result.statuses;
          var profile = JSON.stringify({'contentItems': createDataObject(socialMediaData)});
          getAnalysis(profile);
        })
        .catch(function(reason){$('p').fadeIn(1000).delay(1000).fadeOut(1000)});
  } else {
    getTextAnalysis($textInput);

  }
})

//function to run on result received from the Twitter API
var tweetObj = {
  content: '',
  contenttype: "text/plain",
  created: '',
  id: '',
  language: "en",
  sourceid: "Twitter API",
  userid: ''
};

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
//function for sendng a post request to Watson personality-insights API. This function
// gets invoked on click after the first API call to Tweeter is executed and returns data.
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

    })
}

//function to analyse text input
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

//function for the text uploaded by user in txt format
var $fileInput = $('#inputFile');

$fileInput.on('change', function(e) {
  var file = $fileInput[0].files[0];
  var textType = /text.*/;
  if(file.type.match(textType)){
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e) {
      fileText = reader.result;
      $textInput = fileText;
    }
  } else {
    alert("file not supported")
  }
})

//map analysis object returned by getAnalysis function to a chart
var analysisData = [];
function createChart(analysisData) {
  var $ctx = $('#personalityChart');
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
