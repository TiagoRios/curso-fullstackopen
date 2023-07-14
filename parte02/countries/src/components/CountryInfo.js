import Weather from "./Weather"

export default function CountryInfo({ country }) {
    return (
        <>
            <h1>{country.name.common}</h1>
            <p>Official name: {country.name.official}</p>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area}</p>
            <p>Population: {country.population}</p>

            <h2>Languages:</h2>
            <ul>
                {Object.values(country.languages).map(l => <li key={l}>{l}</li>)}
            </ul>
            <img src={country.flags.png} alt={country.flags.alt} />

            <Weather capital={country.capital} />
        </>
    )
}