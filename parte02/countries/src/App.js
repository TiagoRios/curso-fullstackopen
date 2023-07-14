import React, { useEffect, useState } from 'react';
import countryService from './services/countryService';

import FilterInput from './components/FilterInput';
import FilteredCountries from './components/FilteredCountries';

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
        <>
            <h1>Data for countries App</h1>

            <FilterInput value={inputFilterCountry} onChange={handleInputFilterCountryChange} />
            <br />
            <FilteredCountries countries={countries} inputToFilter={inputFilterCountry} />
        </>
    )
}