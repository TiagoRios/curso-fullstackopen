import axios from "axios";
import { useEffect, useState } from "react"

export default function Weather({ capital }) {
    const [icon, setIcon] = useState(null);
    const [weather, setWeather] = useState([]);

    const api_key = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}`)
            .then(res => {
                setIcon(`https:/openweathermap.org/img/wn/${res.data.weather[0].icon}.png`);
                setWeather(res.data)
            }).catch((err) => console.log("Error::: ", err))
    }, []);

    return (
        <div>
            <h2>Weather in {capital}</h2>
            <p>Temperature: {kevinToCelsius(weather.main?.temp)} Celcius</p>

            {icon && <img height="120px" width="120px" src={icon} alt={weather.weather[0].description} />}

            <p>wind {weather.wind?.speed} m/s</p>
        </div>
    )
}

let kevinToCelsius = (kelvin) => {
    return kelvin - 273.15;
}