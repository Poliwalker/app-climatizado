const key = 'bd162a5833ad3e213a7d06d852175d2e';

const requestCity = async (city) => {
	const baseURL = `https://api.openweathermap.org/data/2.5/weather`;
	const query = `?q=${city}&appid=${key}`;
	const response = await fetch(baseURL + query);
	const data = await response.json();
	return data;
};
