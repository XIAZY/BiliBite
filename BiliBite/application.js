var baseURL;

function loadingTemplate() {
    var loadingDoc = "<document><loadingTemplate><activityIndicator><text>Loading Page</text></activityIndicator></loadingTemplate></document>";
    var parser = new DOMParser();
    var parsedTemplate = parser.parseFromString(loadingDoc, "application/xml");
    return parsedTemplate;
}

function getDocumentObjectFromXMLString(XMLString) {
    var parser = new DOMParser();
    var parsed = parser.parseFromString(XMLString, "application/xml");
    return parsed;
}

function alertTemplate() {
    var alertDoc = "<document><alertTemplate><title>Error</title><description>Page failed to load</description></alertTemplate></document>";
    var parser = new DOMParser();
    var parsedTemplate = parser.parseFromString(alertDoc, "application/xml");
    return parsedTemplate;
}

function loadAndPushDocument(url) {
    var loadingDocument = loadingTemplate();
    navigationDocument.pushDocument(loadingDocument);
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    
    request.onreadystatechange = function() {
        if (request.readyState != 4) {
            return;
        }
        
        if (request.status == 200) {
            var document = request.responseXML;
            document.addEventListener("select", handleSelectEvent);
            navigationDocument.replaceDocument(document, loadingDocument);
        }
        else {
            navigationDocument.popDocument();
            var alertDocument = alertTemplate();
            navigationDocument.presentModal(alertDocument);
        }
    };
    request.send();
}

function pushDocumentFromDocumentObject(newDocument) {
    navigationDocument.pushDocument(newDocument);
}

function updateMenuItem(menuItem, url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    
    request.onreadystatechange = function() {
        if (request.status == 200) {
            var document = request.responseXML;
            document.addEventListener("select", handleSelectEvent);
            var menuItemDocument = menuItem.parentNode.getFeature("MenuBarDocument");
            menuItemDocument.setDocument(document, menuItem)
        }
    };
    
    request.send();
}

function handleSelectEvent(event) {
    var selectedElement = event.target;
    
    var targetURL = selectedElement.getAttribute("selectTargetURL");
    var avNumber = selectedElement.getAttribute("av");
    
    if (!targetURL && !avNumber) {
        return;
    }
    targetURL = baseURL + targetURL;
    
    if (selectedElement.tagName == "menuItem") {
        updateMenuItem(selectedElement, targetURL);
    } else if (selectedElement.tagName == "listItemLockup"){
        pushDocumentFromAVnumber(avNumber);
    } else {
        loadAndPushDocument(targetURL);
    }
}

function getVideoArrayFromAVNumber(avNumber) {
    var loadJSONAPI = "https://www.biliplus.com/api/geturl?av=" + avNumber;
    var jsonString = getStringFromURL(loadJSONAPI);
    var directVideoCollection = JSON.parse(jsonString)['data'];
    var videoArray = new Array();
    for (var i=0, len=directVideoCollection.length; i < len; i++) {
        if (directVideoCollection[i]["type"] == "single") {
            videoArray.push(directVideoCollection[i]);
        }
    }
    return videoArray;
}

function pushDocumentFromAVnumber(avNumber) {
    var videoArray = getVideoArrayFromAVNumber(avNumber);
    var XMLString = getVideoListXMLStringFromVideoArrayOfDictionary(videoArray);
    var documentObject = getDocumentObjectFromXMLString(XMLString);
    pushDocumentFromDocumentObject(documentObject);
}

function getVideoListXMLStringFromVideoArrayOfDictionary(inputArray, albumTitle, videoTitle) {
    var XMLAlbumTitleLine = "<title>" + albumTitle + "</title>";
    var XMLVideoTitleLine = "<title>" + videoTitle + "</title>";
    var XMLHeader = "<document><listTemplate><banner>" + XMLAlbumTitleLine + "</banner><list><header>" + XMLVideoTitleLine + "</header><section>";
    var XMLString = XMLHeader;
    for (var i=0, len=inputArray.length; i < len; i++) {
        var videoDict = inputArray[i];
        var videoName = videoDict["name"];
        var videoURL = videoDict["url"];
        var listItemLockupString = '<listItemLockup onselect="playMedia(\'' + videoURL.replace(new RegExp('&', 'g'), '&amp;') + '\', \'video\')"><title>' + videoName + '</title><relatedContent><lockup></lockup></relatedContent></listItemLockup>';
        XMLString = XMLString + listItemLockupString;
    }
    var XMLFooterString = "</section></list></listTemplate></document>";
    XMLString = XMLString + XMLFooterString;
    return XMLString;
}

function getStringFromURL(url) {
    var request = new XMLHttpRequest;
    request.open("GET", url, false);
    request.send();
    return request.response;
}

function playMedia(videourl, mediaType) {
    var singleVideo = new MediaItem(mediaType, videourl);
    var videoList = new Playlist();
    videoList.push(singleVideo);
    var myPlayer = new Player();
    myPlayer.playlist = videoList;
    myPlayer.play();
}

App.onLaunch = function(options) {
    debug("test");
    baseURL = options.BASEURL;
    var startDocumentURL = baseURL + "menuBar.xml";
    
    loadAndPushDocument(startDocumentURL);
}
