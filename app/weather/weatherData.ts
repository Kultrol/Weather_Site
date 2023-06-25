// Define an interface for the location data structure.
export interface Location {
    zip: string; // ZIP code of the location
    name: string; // Name of the location
    lat: string; // Latitude of the location
    lon: string; // Longitude of the location
    country: string; // Country where the location is situated
}

// Define an interface for the weather information data structure.
export interface WeatherInfo {
    coord: {
        lon: number; // Longitude of the location for which weather information is fetched
        lat: number; // Latitude of the location for which weather information is fetched
    };
    weather: Array<{ // An array of weather information
        id: number; // Weather condition id
        main: string; // Group of weather parameters (Rain, Snow, Extreme, etc.)
        description: string; // Weather condition within the group
        icon: string; // Weather icon id
    }>;
    base: string; // Internal parameter
    main: {
        temp: number; // Temperature
        feels_like: number; // Human perception of weather
        temp_min: number; // Minimum temperature
        temp_max: number; // Maximum temperature
        pressure: number; // Atmospheric pressure
        humidity: number; // Humidity percentage
    };
    visibility: number; // Visibility, meters
    wind: {
        speed: number; // Wind speed
        deg: number; // Wind direction, degrees (meteorological)
    };
    clouds: {
        all: number; // Cloudiness, %
    };
    dt: number; // Time of data calculation, unix, UTC
    sys: {
        type: number; // Internal parameter
        id: number; // Internal parameter
        country: string; // Country code (GB, JP etc.)
        sunrise: number; // Sunrise time, unix, UTC
        sunset: number; // Sunset time, unix, UTC
    };
    timezone: number; // Shift in seconds from UTC
    id: number; // City ID
    name: string; // City name
    cod: number; // Internal parameter
}

// Define an interface for the coordinates data structure.
export interface Coordinates {
    lat: string, // Latitude
    lon: string; // Longitude
}

// Define an asynchronous function to get latitude and longitude data based on a zip code.
export const getZip = async (zipCode:string, apiKey: string): Promise<Coordinates | number> => {
    // Initialize an object to store the coordinates.
    let coordinates: Coordinates = {lat: '', lon: ''};

    // Fetch data from the OpenWeatherMap API using a specific zip code.
    const zipResponse: Response = await fetch(`https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=${apiKey}`);

    // Check if the response status is not 200 (OK), and throw an error if not.
    if (zipResponse.status !== 200) {
        const errorResponse = await zipResponse.json();
        // Log the error message and status code to the console
        console.error(`API Error: ${errorResponse.message}\nStatus Code: ${zipResponse.status}`);
        // Return the status code
        return(zipResponse.status);
    }

    // Parse the response to JSON.
    const zipData: Location = await zipResponse.json();

    // Extract latitude and longitude from the JSON data and store them in the coordinates object.
    coordinates.lon = zipData.lon;
    coordinates.lat = zipData.lat;

    // Return the coordinates object.
    return coordinates;
};

// Define an asynchronous function to get the current weather data for a specific location based on latitude and longitude.
export const getWeather = async (zipData: Coordinates, apiKey: string): Promise<WeatherInfo| number> => {
    // Store the coordinate data.
    const coordinates: Coordinates = zipData;

    // Fetch weather data from the OpenWeatherMap API using the coordinates obtained earlier.
    const currentWeatherResponse: Response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${apiKey}`);

    // Check if the response status is not 200 (OK), and throw an error if not.
    if (currentWeatherResponse.status !== 200) {
        const errorResponse = await currentWeatherResponse.json();
        // Log the error message and status code to the console
        console.error(`API Error: ${errorResponse.message}\nStatus Code: ${currentWeatherResponse.status}`);
        // Return the status code
        return(currentWeatherResponse.status);
    }

    // Parse the response to JSON and return it.
    return await currentWeatherResponse.json();
};
