// English regions and their associated abbreviations
const regions = {
    southwestengland: "SW",
    london: "SE",
    southeastengland: "SE",
    eastmidlands: "EM",
    westmidlands: "WM",
    yorkshireandthehumber: "YH",
    northeastengland: "NE",
    northwestengland: "NW",
};

// Runs on app launch
window.onload = function() {
    var locationPrivilege = "http://tizen.org/privilege/location";
    var result = tizen.ppm.checkPermission(locationPrivilege);

    switch (result) {
        case "PPM_ALLOW":
            permissionSuccessCallback();
            break;
        case "PPM_DENY":
            permissionDeniedCallback();
            break;
        case "PPM_ASK":
            // Request user permission
            tizen.ppm.requestPermission(locationPrivilege, permissionSuccessCallback, permissionErrorCallback);
            break;
        default:
            alert("An error occurred while getting permissions");
            break;
    }
};

function permissionSuccessCallback() {
    callGeoLocationService()
}

function permissionDeniedCallback() {
    alert("Permission denied, you must grant permission in settings");
    tizen.application.getCurrentApplication().exit();
}


function permissionErrorCallback(error) {
    alert(error);
    tizen.application.getCurrentApplication().exit();
}


// Function to get the current GPS coordinates of the user
function callGeoLocationService() {
    var options = {
        enableHighAccuracy: false,
        maximumAge: 1000 * 15,
        timeout: 20000,
    };
    try {
        navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError, options);
    } catch (e) {
        alert('Geolocation Error: ' + e.message + " [" + e.name + "]");
        tizen.application.getCurrentApplication().exit();
    }
}

// Handle GPS errors
function onLocationError(error) {
    switch (error.code) {
        case error.POSITION_UNAVAILABLE:
            alert("Unable to get GPS location");
            break;
        case error.TIMEOUT:
            alert("Timedout trying to get GPS location");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occured trying to get GPS location");
            break;
    }
    tizen.application.getCurrentApplication().exit();
}

function onLocationSuccess(pos) {
    document.getElementById("textbox").textContent = "Getting locale...";
    var myCoords = pos.coords;
    lookupRegion(myCoords);
}

// Get the region (if in England) or the country otherwise
function lookupRegion(pos) {
    const xhr = new XMLHttpRequest();
    const lat = pos.latitude;
    const long = pos.longitude;
    xhr.withCredentials = true;
    xhr.open("GET", "https://reverse-geocoding-to-city.p.rapidapi.com/data/reverse-geocode?latitude=" + lat + "&longitude=" + long + "&localityLanguage=en");
    xhr.setRequestHeader("X-RapidAPI-Key","YOUR API KEY GOES HERE");
    xhr.setRequestHeader("X-RapidAPI-Host", "reverse-geocoding-to-city.p.rapidapi.com");
    xhr.addEventListener("readystatechange", function() {
        if (this.readyState === this.DONE) {
            var data = JSON.parse(this.responseText);
            if (data.length > 1) {
                data = data[0];
            }
            const country = data.localityInfo.administrative[1].name.toLowerCase();
            // Check if it is Wales or Northern Ireland
            if (country.includes("wales")) {
                getWeatherWarnings("WL");
            } else if (country.includes("northern ireland")) {
            	getWeatherWarnings("NI");
            } else {
                // English region lookup
                const str = data.localityInfo.administrative[2].name.toLowerCase();
                const format = str.replace(/\s/g, '');
                getWeatherWarnings(regions[format]);
            }
        }
    });
    xhr.send();
}

// Get weather warnings XML from Met Office
function getWeatherWarnings(region) {
    document.getElementById("textbox").textContent = "Getting weather warnings...";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/Region/" + region);
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var x = document.getElementById("spinner");
            x.style.display = "none";
            parseResponse(this);
        }
    };
    xhr.send();
}

// Parse XML response and update information on screen
function parseResponse(res) {
    var xmlDoc = res.responseXML;
    var x = xmlDoc.getElementsByTagName("title");
    var imageElement = document.getElementById("warning_image");
    if (x.length > 1) {
        // TODO: Check if current time is within validity period
        var title = x[1].childNodes[0].nodeValue.toLowerCase();
        document.getElementById("textbox").textContent = title;
        var details = title.split(" ");
        // E.G. Yellow warning of rain ...
        var warningColour = details[0];
        var weatherType = details[3];
        switchBgColour(warningColour);
        document.getElementById("textbox").textContent = title;
        imageElement.src = "/assets/" + weatherType + ".png";
    } else {
        document.getElementById("textbox").textContent = "No weather warnings for your region.";
        imageElement.src = "/assets/ok.png";
        document.body.style.backgroundColor = "#00ff00";
    }

    imageElement.removeAttribute("hidden");

}
// Change background colour
function switchBgColour(colour) {
    // TODO: Map names to hex colours
    const alertColours = ["yellow", "amber", "red"];
    if (alertColours.includes(colour)) {
        if (colour === "amber") {
            document.body.style.backgroundColor = "#f78b2d";
        } else {
            document.body.style.backgroundColor = colour;
        }
    }
}