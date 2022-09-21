const form = document.getElementById('form');
const cityInput = document.getElementById('city');
const cardContainer = document.querySelector('.card-container');
const waitMsg = document.querySelector('.wait');

let cities = JSON.parse(localStorage.getItem('cities')) || [];

const saveLocalStorage = (citiesList) => {
	localStorage.setItem('cities', JSON.stringify(citiesList));
};

const convertCelcius = (kelvin) => {
	let celcius = Math.round(kelvin - 273.15);
	return celcius;
};

const renderCity = (city) => {
	// const imageName = city.weather[0].icon;
	return `<div class="card-subcontainer">
	<i class="fa-solid fa-x close" data-id="${city.id}"></i>
	<div class="name-city">
		<h2 class="info-title">${city.name}</h2>
		<p class="subtitle">${city.weather[0].description}</p>
		<div class="temp-st">
			<span class="temp">${convertCelcius(city.main.temp)}°</span>
			<span class="st">${convertCelcius(city.main.feels_like)}ST</span>
		</div>
	</div>
	<div class="img-container">
		<img src="http://openweathermap.org/img/wn/${
			city.weather[0].icon
		}@2x.png" alt="sun">
	</div>
	<div class="min-max">
		<span class="temp-max">${convertCelcius(city.main.temp_max)}° MAX</span>
		<span class="temp-min">${convertCelcius(city.main.temp_min)}° MIN</span>
		<div class="humedad-container">
		<span class="humedad">${city.main.humidity}% HUM</span>
		</div>
	</div>
</div>`;
};

const renderCitiesList = (citiesList) => {
	cardContainer.innerHTML = citiesList.map((city) => renderCity(city)).join('');
};

const searchCity = async (e) => {
	e.preventDefault();
	const searchedCity = cityInput.value.trim();
	if (searchedCity === '') {
		alert('Por favor ingresa una ciudad');
		return;
	}
	const fetchedCity = await requestCity(searchedCity);

	if (!fetchedCity.id) {
		alert('la ciudad no existe');
		form.reset();
		return;
	} else if (cities.some((city) => city.id === fetchedCity.id)) {
		alert('ya estamos mostrando el clima de esta ciudad');
		form.reset();
		return;
	}

	cities = [fetchedCity, ...cities];
	renderCitiesList(cities);
	saveLocalStorage(cities);
	form.reset();
};

const hideWaitMsg = (citiesList) => {
	if (citiesList.length !== 0) {
		waitMsg.classList.add('hidden');
		return;
	}
	waitMsg.classList.remove('hidden');
};

const removeCity = (e) => {
	if (!e.target.classList.contains('close')) return;
	const filterId = Number(e.target.dataset.id);
	if (window.confirm('¿Estas seguro que queres eliminar esta card de clima?')) {
		cities = cities.filter((city) => city.id !== filterId);
		renderCitiesList(cities);
		saveLocalStorage(cities);
		hideWaitMsg(cities);
	}
};

const init = () => {
	form.addEventListener('submit', searchCity);
	hideWaitMsg(cities);
	renderCitiesList(cities);
	hideWaitMsg(cities);
	cardContainer.addEventListener('click', removeCity);
};
init();
