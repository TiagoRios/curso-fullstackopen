import Country from "./Country";
import CountryInfo from "./CountryInfo";

export default function FilteredCountries({ countries, inputToFilter }) {
    let filtered = countries.filter((country) => country.name.common.toLowerCase().includes(inputToFilter.toLowerCase()));

    if (filtered.length < 1) {
        return "no matches."
    } else if (filtered.length > 10) {
        return "Too many matches, specify another filter.";
    } else if (filtered.length > 1 && filtered.length <= 10) {
        return (filtered.map(country =>
            <Country country={country} key={country.name.common} />
        ))
    } else if (filtered.length === 1) {
        return (<>
            <CountryInfo country={filtered[0]} />
        </>)
    }
}