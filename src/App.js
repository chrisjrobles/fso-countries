import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getResults = (matches, countryData) => {
  if (!matches) {
    return;
  }
  if (matches.length === 1) {
    const country = countryData[matches[0]];
    return (
      <div>
        <h2>{country.name.common}</h2>
        <p style={{ margin: 0 }}>capital {country.capital[0]}</p>
        <p style={{ margin: 0 }}>area {country.area}</p>
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img
          src={country.flags.svg}
          alt={`${country.name.common} flag`}
          width={200}
        />
      </div>
    );
  }
  if (matches.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {matches.map((match) => (
        <li key={match}>{match}</li>
      ))}
    </ul>
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

  return (
    <div>
      find countries <input type='text' onChange={onChange}></input>
      {getResults(matches, countryData)}
    </div>
  );
};

export default App;
