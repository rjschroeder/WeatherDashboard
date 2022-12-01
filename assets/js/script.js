//declaring element references in html
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

//displays the search history of past searches stored in localStorage
function displaySearchHistory() {
    //if there is no stored data, make a new empty array
    let prevSearches = JSON.parse(window.localStorage.getItem("searchHistory")) || [];
    //before rendering, clear old render, if any
    searchHistoryButtonDiv.textContent = "";
    
    //loops backwards over stored data so most recent searches are at the top
    for(let i = prevSearches.length; i > 0; i--){
        let button = document.createElement("button");
        button.setAttribute("type", "submit");
        button.setAttribute("class", "btn btn-secondary btn-block");
        button.textContent = prevSearches[i-1];

        //imported concept from JS Coding Quiz Challenge
        //adds an event listener right when the button element is created
        //stores a function call to its content
        button.addEventListener("click", event => {
            console.log("Searching for " + button.textContent);
            fetchWeather(prevSearches[i-1]);
        })
        searchHistoryButtonDiv.appendChild(button);
    }
}

//adds the parameter city to the localStorage item and displays search history again
function addToSearchHistory(city) {
    let prevSearches = JSON.parse(window.localStorage.getItem("searchHistory")) || [];
    
    //if the city is already present in the search history, remove it so it is not shown twice
    //is case-sensitive, however
    prevSearches = prevSearches.filter(e => e !== city);

    //if we are going to reach more than 8 previous search buttons, remove the oldest one
    if (prevSearches.length > 7) {
        prevSearches.shift();
    }
    prevSearches.push(city);
    window.localStorage.setItem("searchHistory", JSON.stringify(prevSearches));
    displaySearchHistory();
}

//api call function to get weather data
function fetchWeather(city) {

    //!!!!!!!!!!!!!!TRIAL ENDS ON DECEMBER 15, 2022, API CALL WILL NOT WORK AFTER THAT DATE!!!!!!!!!!
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=ffa335b573f34e679d745524220112&q=${city}&days=6&aqi=yes&alerts=no`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //makes calls to render the current days weather as well as the forecast
            renderCurrent(data["location"], data["current"]);
            renderForecast(data["forecast"]["forecastday"]);
        })
        .catch(function (error) {
            console.error(error);
        });
}

//renders the current day's weather, elements are already created in HTML
function renderCurrent(locationData, currentData) {
    cityDisplaySpan.textContent = `${locationData["name"]}, ${locationData["region"]}`
    //api returns date and timestamp seperated by a space, this returns only date
    dateDisplaySpan.textContent = `(${locationData["localtime"].split(" ")[0]})`
    let weatherStatusSymbol = document.createElement("img");
    weatherStatusSymbol.setAttribute("src", `https:${currentData["condition"]["icon"]}`)
    weatherStatusDisplaySpan.textContent = ""
    weatherStatusDisplaySpan.appendChild(weatherStatusSymbol)
    tempDisplaySpan.textContent = `${currentData["temp_f"]}`
    windDisplaySpan.textContent = `${currentData["wind_mph"]}`
    humidityDisplaySpan.textContent = `${currentData["humidity"]}`
}

//renders the 5-day forecast, elements are created here
function renderForecast(forecastData) {
    //clears previous forecast, if any
    forecastDiv.textContent = "";

    //api returns current day as index 0 of forecast object, for loop needs to begin at index 1 to get future days
    for (let i = 1; i<forecastData.length; i++) {

        //creating elements for each part of the desired data

        let cardContainer = document.createElement("div");
        cardContainer.setAttribute("class", "p-2 m-2 bg-dark text-white rounded");
        cardContainer.setAttribute("style", "width: 20%;");
        
        let dateElement = document.createElement("p");
        dateElement.textContent = forecastData[i]["date"];
        cardContainer.appendChild(dateElement);

        let statusElement = document.createElement("img");
        statusElement.setAttribute("src", `https:${forecastData[i]["day"]["condition"]["icon"]}`);
        cardContainer.appendChild(statusElement);

        let tempElement = document.createElement("p");
        tempElement.textContent = `Temp: ${forecastData[i]["day"]["avgtemp_f"]} °F`
        cardContainer.appendChild(tempElement);

        let windElement = document.createElement("p");
        windElement.textContent = `Wind: ${forecastData[i]["day"]["maxwind_mph"]} MPH`
        cardContainer.appendChild(windElement);

        let humidElement = document.createElement("p");
        humidElement.textContent = `Humidity: ${forecastData[i]["day"]["avghumidity"]} %`
        cardContainer.appendChild(humidElement);

        //append each day card onto the forecast div element
        forecastDiv.appendChild(cardContainer);
    }
}

//displays the search history on start
displaySearchHistory();

//default call to a city to demonstrate view on first startup
fetchWeather("San Diego");

//event listener for city form search button
searchButton.addEventListener("click", event => {
    event.preventDefault();
    if(searchInput.value.trim() !== "") {
        addToSearchHistory(searchInput.value);
        fetchWeather(searchInput.value.trim());
        //clears search box after search
        searchInput.value = "";
    }
})