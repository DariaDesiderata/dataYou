var $submit = $('#submitBttn');
var $inputSocialMedia = $('#inputSocialMedia')
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
var tweetArr = [];

$submit.click(function(evt) {
  evt.preventDefault();
  if($inputSocialMedia) {
   var domain = 'https://galvanize-twitter-proxy.herokuapp.com/search/tweets?q=from%3A';
   var inputData = $inputSocialMedia.val();
   var url = domain + inputData;
      $.get(url,
        function(result) {socialMediaData.statuses = result.statuses})
        .then(function(){
          var profile = JSON.stringify({'contentItems': createDataObject(socialMediaData)})
          getAnalysis(profile)
        })
        .catch(function(reason){alert(reason)})

  } else {
    return $inputText.val()
  }
})

function createDataObject(socialMediaData) {
  //if($inputSocialMedia.val() !== userName) {throw new Error ('Invalid user name')}
  var userName = socialMediaData.statuses[0].user['screen_name'];
  var statusesArr = socialMediaData.statuses;
  statusesArr.forEach(function(status) {
    tweetObj.content = status.text,
    tweetObj.created =
    tweetObj.id = status.id
    tweetObj.userid = status.user['screen_name']
    tweetArr.push(tweetObj)
  })
  return tweetArr;
}

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
      console.log(analysis);
    })
//})
}
