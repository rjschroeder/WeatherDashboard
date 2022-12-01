let searchInput = document.getElementById("inputSearch");
let searchButton = document.getElementById("searchButton");
let searchHistoryButtonDiv = document.getElementById("historyButtons");
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
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=ffa335b573f34e679d745524220112&q=${city}&days=5&aqi=yes&alerts=no`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data["location"], data["current"], data["forecast"]);
        })
        .catch(function (error) {
            console.error(error);
        });
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