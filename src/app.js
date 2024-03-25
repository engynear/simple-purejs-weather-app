document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        let city = this.value;
        getCoordinates(city);
    }
});

function getCoordinates(city) {
    const locationIQApiKey = 'pk.d35a67b9ff8bb68ac50cffda79bb666d';
    const url = `https://eu1.locationiq.com/v1/search.php?key=${locationIQApiKey}&q=${city}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeather(lat, lon);
            } else {
                throw new Error('Координаты не найдены');
            }
        })
        .catch(error => {
            console.error("Ошибка: ", error);
            document.getElementById('weather').textContent = 'Не удалось найти город. Попробуйте другой запрос.';
        });
}

function getWeather(lat, lon) {
    const apiKey = 'df45c0b8cbb4d3377b7c883d8f48c169';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Погодные данные не найдены');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error("Ошибка: ", error);
            document.getElementById('weather').textContent = 'Погода не найдена. Попробуйте другой город.';
        });
}

function displayWeather(data) {
    const { main, weather } = data;
    let iconClass = "fas fa-sun";
    if (weather[0].main === "Clouds") {
        iconClass = "fas fa-cloud";
    } else if (weather[0].main === "Rain") {
        iconClass = "fas fa-cloud-rain";
    }

    document.getElementById('weather').innerHTML = `
        <i class="${iconClass} weather-icon"></i>
        <p class="temp">${main.temp}°C</p>
        <p class="description">${weather[0].description}</p>
    `;
}