import Weather from "./Weather"

export default function CountryInfo({ country }) {
    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 id={country.name.common} style={{ textAlign: "center" }}>{country.name.common}</h1>
                <img
                    style={{ width: "300px", boxShadow: "rgba(0, 0, 0, 0.34) 0px 3px 8px" }}
                    src={country.flags.png} alt={country.flags.alt} />
            </div>
            <p>Official name: {country.name.official}</p>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area}</p>
            <p>Population: {country.population}</p>

            {/* OBS: Antarctica language is undefined */}
            <h2>Languages:</h2>

            {country.languages === undefined ?
                <p>*** {country.name.common} has no language.</p> :
                <ul>
                    {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
                </ul>
            }
            <Weather capital={country.capital} />
        </div>
    )
}