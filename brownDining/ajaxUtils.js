(function (global) {
	var ajaxUtils = {};

	function getRequestObject() {
		if (window.XMLHttpRequest) {
			return (new XMLHttpRequest());
		}
	}

	ajaxUtils.sendGetRequest =
		function(requestUrl, responseHandler, isJSONResponse) {
			var request = getRequestObject();
			request.onreadystatechange =
				function() {
					handleResponse(request, responseHandler, isJSONResponse);
				};
			request.open("GET", requestUrl, true);
			request.send(null);
		}

	function handleResponse(request, responseHandler, isJSONResponse) {
		if ((request.readyState == 4) && (request.status == 200)) {
			if (isJSONResponse == undefined) {
				isJSONResponse = true;
			}

			if (isJSONResponse) {
				responseHandler(JSON.parse(request.responseText));
			} else {
				responseHandler(request.responseText);
			}
		}
	}

	global.$ajaxUtils = ajaxUtils;

})(window);