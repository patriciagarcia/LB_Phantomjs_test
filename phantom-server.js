var system = require('system'),
    page = require('webpage').create(),
    url = system.args[1],
    server = system.args[2];

var lastReceived = new Date().getTime();
var requestCount = 0;
var responseCount = 0;
var requestIds = [];
var startTime = new Date().getTime();

page.onResourceReceived = function (response) {
  if(requestIds.indexOf(response.id) !== -1) {
    lastReceived = new Date().getTime();
    responseCount++;
    requestIds[requestIds.indexOf(response.id)] = null;
  }
};
page.onResourceRequested = function (request, networkRequest) {
  if(request['url'].indexOf(server) != -1 ){
    if(requestIds.indexOf(request.id) === -1) {
      requestIds.push(request.id);
      requestCount++;
    }
  } else {
    // Abort all resource requests to external servers
    networkRequest.abort();  
  }
};

// Open the page
page.open(url);


var checkComplete = function () {
  //if((new Date().getTime() - lastReceived > 300 && requestCount === responseCount) || new Date().getTime() - startTime > 5000)  {
  // don't return until all requests are finished
  if((new Date().getTime() - lastReceived > 300 && requestCount === responseCount)){
    clearInterval(checkCompleteInterval);
    var loadingTime = new Date().getTime() - startTime;
    console.log('Interval ' + loadingTime);
    console.log(page.content);
    phantom.exit();
  }
}

// Let us check to see if the page is finished rendering
var checkCompleteInterval = setInterval(checkComplete, 1);
