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
            //do search here
        })
        searchHistoryButtonDiv.appendChild(button);
    }
}
let temp = ["Atlanta", "Austin", "Amarillo", "Anaheim"]
window.localStorage.setItem("searchHistory", JSON.stringify(temp));
displaySearchHistory();