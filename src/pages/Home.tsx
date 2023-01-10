import { useEffect, useState } from 'react';
import './Home.css';
import counties from '../counties';
import Temperature from '../components/Temperature';
import Wind from '../components/Wind';
import Air from '../components/Air';
import Pressure from '../components/Pressure';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import axios from 'axios';

interface City {
  name: string,
  country: string,
  lat: number,
  lon: number,
  sunrise: Date,
  sunset: Date,
}

interface Temp {
  temp: number;
  feels_like: number;
}

interface WindProps {
  speed: number;
  gust: number;
  deg: number;
}

interface AirProps {
  humidity: number;
}

interface PressureProps {
  pressure: number;
}

interface UrlProps {
  lat: number,
  lon: number,
  api_key: unknown,
}

const Home: React.FC = () => {
  // Variables
  const [img, setImg] = useState<string>("sunny");
  const [showLocations, setShowLocations] = useState<boolean>(false);
  const [urlProps, setUrlProps] = useState<UrlProps>({
    lat: -1.2921,
    lon: 36.8219,
    api_key: process.env.REACT_APP_OPENWEATHER,
  });
  const [city, setCity] = useState<City>({
    name: "",
    country: "",
    lat: 0,
    lon: 0,
    sunrise: new Date(),
    sunset: new Date(),
  });
  const [desc, setDesc] = useState<string>("");
  const [clouds, setClouds] = useState<number>(0);
  const [visibility, setVisibility] = useState<number>(0);
  const [temperature, setTemperature] = useState<Temp>({
    temp: 0,
    feels_like: 0,
  });
  const [wind, setWind] = useState<WindProps>({
    speed: 0,
    gust: 0,
    deg: 0,
  });
  const [airProps, setAirProps] = useState<AirProps>({
    humidity: 0,
  });
  const [pressureProps, setPressureProps] = useState<PressureProps>({
    pressure: 0,
  });

  // Logic
  const changeLocationsVisibility = (): void => {
    setShowLocations(prevShowLocations => !prevShowLocations);
  }

  const progressBar = (): number => {
    return (visibility/10000)*100;
  }

  const setLocation = (lat: number, lon: number): void => {
    setUrlProps((prevUrlProps) => (
      {
        ...prevUrlProps,
        lat: lat,
        lon: lon,
      }
    ));
    changeLocationsVisibility();
    forecast();
  }

  const changeImg = (main: string, sunset: number): void => {
    if (new Date().getHours() < sunset) {
      if (main === "Snow") {
        setImg("snow")
      } else if (main === "Rain") {
        setImg("heavy_rain")
      } else if (clouds > 30) {
        setImg("partially_sunny")
      } else if (clouds < 29) {
        setImg("cloudy")
      } else {
        setImg("sunny")
      }
    } else {
      if (main === "Snow") {
        setImg("snow")
      } else if (main === "Rain") {
        setImg("heavy_rain")
      } else if (clouds > 30) {
        setImg("cloudy_night")
      } else if (clouds < 29) {
        setImg("cloudy")
      } else {
        setImg("clear_night")
      }
    }
  }

  const forecast = () => {
    let i: number = 0;
    let time_to_use: number = 0;

    if (new Date().getHours() < 3) {
      time_to_use = 3;
    } else if (new Date().getHours() < 6) {
      time_to_use = 6;
    } else if (new Date().getHours() < 9) {
      time_to_use = 9;
    } else if (new Date().getHours() < 12) {
      time_to_use = 12;
    } else if (new Date().getHours() < 15) {
      time_to_use = 15;
    } else if (new Date().getHours() < 18) {
      time_to_use = 18;
    } else if (new Date().getHours() < 21) {
      time_to_use = 21;
    }

    const url: string = `https://api.openweathermap.org/data/2.5/forecast?lat=${urlProps.lat}&lon=${urlProps.lon}&appid=${urlProps.api_key}&units=metric`;
    axios.get(url).then((response): void => {
      const {city, list} = response.data;
      for (let a=0; a<list.length-1; a++) {
        if (new Date(list[a].dt*1000).toDateString() === new Date().toDateString()) {
          if (new Date(list[a].dt*1000).getHours() === time_to_use) {
            i = a;
          }
        }
      }
      const {clouds, main, visibility, weather, wind} = list[i];

      setDesc(weather[0].description);
      setClouds(clouds.all);
      setVisibility(visibility);
      setCity(prevCity => (
        {
          ...prevCity,
          name: city.name,
          country: city.country,
          lat: city.coord.lat,
          lon: city.coord.lon,
          sunrise: new Date(city.sunrise * 1000),
          sunset: new Date(city.sunset * 1000),
        }
      ));
      setTemperature(prevTemperature => ({
        ...prevTemperature,
        temp: main.temp,
        feels_like: main.feels_like,
      }));
      setWind(prevWind => ({
        ...prevWind,
        speed: wind.speed,
        gust: wind.gust,
        deg: wind.deg,
      }));
      setAirProps(prevAirProps => ({
        ...prevAirProps,
        humidity: main.humidity,
      }));
      setPressureProps(prevPressureProps => ({...prevPressureProps, pressure: main.pressure}));
      changeImg(weather[0].main, new Date(city.sunset * 1000).getHours());
    });
  }

  useEffect(() => forecast(), []);

  return (
    <div className="home">
      <div className="top">
        <div className="main">
          <img src={`/assets/vectors/${img}.png`} alt="Partially Sunny" />
          <div className="other">
            <span>{desc}</span>
            <div className="clouds">
              <span>Cloud Cover:</span>
              <span>{clouds}%</span>
            </div>
            <div className="visibility">
              <div className="graphic">
                <AiOutlineEyeInvisible/>
                <div className="progressbar">
                  <div className="active" style={{width: `${progressBar()}%`}}></div>
                </div>
                <AiOutlineEye/>
              </div>
              <span>{visibility} meters</span>
            </div>
          </div>
          <div className="sun">
            <div className="rise">
              <span>Sunrise</span>
              <span>{city.sunrise.toLocaleTimeString()}</span>
            </div>
            <div className="set">
              <span>Sunset</span>
              <span>{city.sunset.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="units">
            <div>
              <span>
                <sup>o</sup>
                C
              </span>
            </div>
          </div>
        </div>
        <div className="column">
          <Temperature {...temperature} />
          <Wind {...wind} />
          <Air {...airProps} />
          <Pressure {...pressureProps} />
        </div>
        <div className="location">
          <div className="time">
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="city">
            <span>{city.name}, {city.country}</span>
          </div>
          <div className="coord">
            <span>Latitude: {city.lat}</span>
            <span>Longitude: {city.lon}</span>
          </div>
          <button onClick={changeLocationsVisibility}>
            <span>Show Towns/Cities</span>
          </button>
        </div>
      </div>
      <div className={showLocations ? "locations active" : "locations"}>
        {counties.map((location) => {
          return <div key={location.hq} onClick={() => setLocation(location.lat, location.lon)}>
            <span>{location.hq}</span>
          </div>;
        })}
      </div>
    </div>
  );
}

export default Home;