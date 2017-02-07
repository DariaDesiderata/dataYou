var $submit = $('#submitBttn');
var $inputSocialMedia = $('#inputSocialMedia')
var tweetArr = [];
var tweetObj = {
  content: '',
  contenttype: "text/plain",
  created: '',
  id: '',
  language: "en",
  sourceid: "Twitter API",
  userid: ''
};

//on change of $inputSocialMedia -> disable Sample text box and the other way around

var socialMediaData = {};

$submit.click(function(evt) {
  evt.preventDefault();
  if($inputSocialMedia) {
   var domain = 'https://galvanize-twitter-proxy.herokuapp.com/search/tweets?q=from%3A';
   var inputData = $inputSocialMedia.val();
   var url = domain + inputData;

    $.get(url,
      function(result) {socialMediaData.statuses = result.statuses})
      .then(createDataObject)
      .catch(function(){alert("error")})
  } else {
    return $inputText.val()
  }
})

function createDataObject(socialMediaData) {
  var userName = socialMediaData.statuses[0].user['screen_name']

  //if($inputSocialMedia !== userName) {alert("Invalid social media account")}
  var statusesArr = socialMediaData.statuses;
  statusesArr.forEach(function(status) {
    tweetObj.content = status.text,
    tweetObj.created =
    tweetObj.id = status.id
    tweetObj.userid = status.user['screen_name']
  })
  console.log(tweetObj);
  tweetArr.push(status)
}

//next step - JSON.stringify(tweetArr)
//use that JSON object line 43

//

// $(document).ready(function() {
//   $.get('/profile.json').then(function(profile) {
//     $.ajax({
//       type: 'POST',
//       url: 'https://galvanize-cors-proxy.herokuapp.com/https://watson-api-explorer.mybluemix.net/personality-insights/api/v3/profile?version=2017-02-01',
//       contentType: 'application/json',
//       data: JSON.stringify(profile),
//       headers: {
//         "Authorization": "Basic Y2RjZjZjMWEtN2Q0Yy00YzA0LWJiNmUtZTE4MmIxNDdmMzAwOkdna1dBUGNQREZhMQ=="
//       }
//     }).then(function(analysis) {
//       console.log(analysis);
//     })
//   })
// })
