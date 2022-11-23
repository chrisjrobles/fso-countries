import React, { useEffect, useState, Fragment } from 'react';
import axios from 'axios';

const kToF = (k) => Math.round(((k - 273.15) * 9) / 5 + 32);

const Weather = ({ capital, lat, lng }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    const getWeather = async () => {
      const response =
        await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.REACT_APP_WEATHER_API_KEY}
      `);
      setWeather(response.data);
    };
    capital && getWeather();
  }, [capital, lat, lng]);

  return (
    <div>
      <h2>Weather in {capital}</h2>
      {weather.main ? (
        <Fragment>
          <p style={{ margin: 0 }}>temperature {kToF(weather.main.temp)}° F</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={`${weather.weather[0].description} icon`}
          />
          <p style={{ margin: 0 }}>wind {weather.wind.speed} m/s</p>
        </Fragment>
      ) : (
        'no weather'
      )}
    </div>
  );
};

const CountryInfo = ({ countryData }) => {
  return (
    <div>
      <h2>{countryData.name.common}</h2>
      <p style={{ margin: 0 }}>
        {countryData.capital
          ? `capital ${countryData.capital[0]}`
          : 'No capital'}
      </p>
      <p style={{ margin: 0 }}>area {countryData.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.values(countryData.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img
        src={countryData.flags.svg}
        alt={`${countryData.name.common} flag`}
        width={200}
      />
      {countryData.capital ? (
        <Weather
          capital={countryData.capital[0]}
          lat={countryData.capitalInfo.latlng[0]}
          lng={countryData.capitalInfo.latlng[1]}
        />
      ) : (
        <Weather
          capital={countryData.name.common}
          lat={countryData.latlng[0]}
          lng={countryData.latlng[1]}
        />
      )}
    </div>
  );
};

const App = () => {
  const [matches, setMatches] = useState([]);
  const [countryData, setCountryData] = useState({});
  const [countryNames, setCountryNames] = useState([]);

  const onChange = (e) => {
    const query = e.target.value;
    setMatches(
      countryNames.filter((countryName) =>
        countryName.toLowerCase().includes(query)
      )
    );
  };

  useEffect(() => {
    const getCountryData = async () => {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      const countries = response.data;
      setCountryNames(countries.map((country) => country.name.common));
      setCountryData(
        countries.reduce(
          (total, prev) => ({ ...total, [prev.name.common]: prev }),
          {}
        )
      );
    };
    getCountryData();
  }, []);

  let response;
  if (!matches.length) {
    response = <p>No countries match the filter</p>;
  } else if (matches.length === 1) {
    response = <CountryInfo countryData={countryData[matches[0]]} />;
  } else if (matches.length > 10) {
    response = <p>Too many matches, specify another filter</p>;
  } else {
    response = (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {matches.map((match) => (
          <li key={match}>
            {match}{' '}
            <button
              onClick={() => {
                setMatches([match]);
              }}
            >
              show
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      find countries <input type='text' onChange={onChange}></input>
      {response}
    </div>
  );
};

export default App;
