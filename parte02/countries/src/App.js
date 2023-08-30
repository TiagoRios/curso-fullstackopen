import React, { useEffect, useState } from 'react';
import countryService from './services/countryService';

import FilterInput from './components/FilterInput';
import FilteredCountries from './components/FilteredCountries';
import FlagAllCountries from './components/FlagsAllCountriess';

export default function App() {
    const [countries, setCountries] = useState([]);
    const [inputFilterCountry, setInputFilterCountry] = useState("");

    useEffect(() => {
        countryService.getAll().then(data => {
            setCountries(data);
        })
    }, [])

    const handleInputFilterCountryChange = (e) => {
        setInputFilterCountry(e.target.value);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 id="header">Data for countries App</h1>

            <FilterInput value={inputFilterCountry} onChange={handleInputFilterCountryChange} />
            <br />
            <FilteredCountries countries={countries} inputToFilter={inputFilterCountry} />
            
            <FlagAllCountries countries={countries} onClick={setInputFilterCountry}/> 

        </div>
    )
}