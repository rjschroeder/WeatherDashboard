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
            getCoords(prevSearches[i-1]);
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
    let { lat } = city;
    let { lon } = city;
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&APPID=c4d23eaac43df15072a6258b8a61f3d9`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("data here:" + data);
        })
        .catch(function (error) {
            console.error(error);
        })
}

function getCoords(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&APPID=c4d23eaac43df15072a6258b8a61f3d9`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if(data[0]) {
                fetchWeather(data[0]);
            } else {
                console.log(city + "was not found.");
            }
        })
        .catch(function (error) {
            console.error(error);
        })
}

// let temp = ["Atlanta", "Austin", "Amarillo", "Anaheim"]
// window.localStorage.setItem("searchHistory", JSON.stringify(temp));
displaySearchHistory();

searchButton.addEventListener("click", event => {
    event.preventDefault();
    if(searchInput.value.trim() !== "") {
        addToSearchHistory(searchInput.value);
        getCoords(searchInput.value.trim());
        searchInput.value = "";
    }
})