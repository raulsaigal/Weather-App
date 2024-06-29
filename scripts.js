const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector("[data-weatherContainer]");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// intially variable needs
let currentTab = userTab;
const API_KEY = "48573878f5b4ee45720dfb39e4753c9e";
// The classList property returns the CSS classnames of an element.
currentTab.classList.add("current-tab");
// if in your current location is already present in sessionstorage 
// so it will automatically show your current location weather
getfromSessionStorage();

// switchTab function create
function switchTab(clickTab) {
    if (clickTab != currentTab) {
        // first remove color from background of cuurent tab
        currentTab.classList.remove("current-tab");
        currentTab = clickTab;
        // And then add same color from background of cuurent tab
        currentTab.classList.add("current-tab");
    }

    // i asked Q that in searchFrom contain any active class or not 
    if (!searchForm.classList.contains("active")) {
        // if it says no then...
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        // now we are at yourweather tab
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    // Now we are at your weather tab so now we directly show my current weather 
    // so for that we create a function to get my location in my storage
    // my coordinates, if we have saved then there...
    getfromSessionStorage();
    }
    

}

userTab.addEventListener("click", () => {
    // click action perform after passing click input on userTab
    switchTab(userTab);
});


searchTab.addEventListener("click", () => {
    // click action perform after passing click input on searchTab
    switchTab(searchTab);
});


// if coordinates are present in seesion
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        // if localCoordinates are not found
        grantAccessContainer.classList.add("active");

    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

// Now we have to call API call 
async function fetchUserWeatherInfo(coordinates) {
    // here to get lat,lon from coordinates
    const {lat, lon} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible while it fetch your coordinates
    loadingScreen.classList.add("active");

    // API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();

        // IF i get my location then i remove loader
        loadingScreen.classList.remove("active");
        // now i have to userInfo-conatiner
        userInfoContainer.classList.add("active");
        // Now when we got weather info then i have to show in my UI
        // How? --> by renderthat weatherinfo 
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        console.log("Location Not Found", (err))

    }

}

function renderWeatherInfo(weatherInfo) {
    // firstly ,we have to fetch the all the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    // fetch values from weatherInfo object and put in UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} km/h`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        // HW--> show an alert for no geolocation is available
    }
}

function showPosition(position) {
    // Now we have to create an userCoordinates object to store lon,lati
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    // now to store these coordinates in sessionStorage
    // And we converted these userCoordinates into string
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    // Now to have to show on UI 
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getlocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    // we wanted to remove the default action/method
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName == "") return;

    else
        fetchSearchWeatherInfo(cityName);

})

// we have to call the API calls so we use async function
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch (err) {

    }
}