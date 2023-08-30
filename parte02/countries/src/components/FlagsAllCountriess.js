// Extra component
// It is not part of the exercises.

export default function FlagAllCountries({ countries, onClick }) {

    return (<>
        <h1>Flag all countries</h1>
        <div style={{ display: "flex", flexDirection: "row", flexWrap: 'wrap', gap: "5px" }}>
            {countries.map(
                country => (<a
                    key={country.name.common}
                    onClick={() => onClick(country.name.common)}
                    href={`#${country.name.common}`}>

                    <img
                        style={{ borderRadius: "50%", width: "50px", height: "50px" }}
                        title={country.name.common}
                        src={country.flags.png} alt={country.flags.alt}
                    />
                </a>)
            )}
        </div>
    </>)
}