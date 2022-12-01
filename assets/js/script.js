let searchInput = document.getElementById("inputSearch");
let searchButton = document.getElementById("searchButton");
let searchHistoryButtonDiv = document.getElementById("historyButtons");
let dateDisplaySpan = document.getElementById("dateDisplay");
let weatherStatusDisplaySpan = document.getElementById("weatherStatusDisplay");
let cityDisplaySpan = document.getElementById("cityDisplay");
let tempDisplaySpan = document.getElementById("tempDisplay");
let windDisplaySpan = document.getElementById("windDisplay");
let humidityDisplaySpan = document.getElementById("humidityDisplay");
let forecastDiv = document.getElementById("forecastDiv");

function displaySearchHistory() {
    let prevSearches = JSON.parse(window.localStorage.getItem("searchHistory")) || [];
    searchHistoryButtonDiv.textContent = "";
    for(let i = prevSearches.length; i > 0; i--){
        let button = document.createElement("button");
        button.setAttribute("type", "submit");
        button.setAttribute("class", "btn btn-secondary btn-block");
        button.textContent = prevSearches[i-1];
        button.addEventListener("click", event => {
            console.log("Searching for " + button.textContent);
            fetchWeather(prevSearches[i-1]);
        })
        searchHistoryButtonDiv.appendChild(button);
    }
}

function addToSearchHistory(city) {
    let prevSearches = JSON.parse(window.localStorage.getItem("searchHistory")) || [];
    prevSearches = prevSearches.filter(e => e !== city);
    if (prevSearches.length > 7) {
        prevSearches.shift();
    }
    prevSearches.push(city);
    window.localStorage.setItem("searchHistory", JSON.stringify(prevSearches));
    displaySearchHistory();
}

function fetchWeather(city) {
    //!!!!!!!!!!!!!!TRIAL ENDS ON DECEMBER 15, 2022, API CALL WILL NOT WORK AFTER THAT DATE!!!!!!!!!!
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=ffa335b573f34e679d745524220112&q=${city}&days=6&aqi=yes&alerts=no`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data["forecast"]);
            renderCurrent(data["location"], data["current"]);
            renderForecast(data["forecast"]["forecastday"]);
        })
        .catch(function (error) {
            console.error(error);
        });
}

function renderCurrent(locationData, currentData) {
    cityDisplaySpan.textContent = `${locationData["name"]}, ${locationData["region"]}`
    dateDisplaySpan.textContent = `(${locationData["localtime"].split(" ")[0]})`
    let weatherStatusSymbol = document.createElement("img");
    weatherStatusSymbol.setAttribute("src", `https:${currentData["condition"]["icon"]}`)
    weatherStatusDisplaySpan.textContent = ""
    weatherStatusDisplaySpan.appendChild(weatherStatusSymbol)
    tempDisplaySpan.textContent = `${currentData["temp_f"]}`
    windDisplaySpan.textContent = `${currentData["wind_mph"]}`
    humidityDisplaySpan.textContent = `${currentData["humidity"]}`
}

function renderForecast(forecastData) {
    forecastDiv.textContent = "";
    for (let i = 1; i<forecastData.length; i++) {
        console.log(forecastData[i]);
    }
}

displaySearchHistory();

searchButton.addEventListener("click", event => {
    event.preventDefault();
    if(searchInput.value.trim() !== "") {
        addToSearchHistory(searchInput.value);
        fetchWeather(searchInput.value.trim());
        searchInput.value = "";
    }
})