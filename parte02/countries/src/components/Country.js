import { useState } from "react"
import CountryInfo from "./CountryInfo";

export default function Country({ country }) {
    const [show, setShow] = useState(false);

    let handleShowClick = () => {
        setShow(!show);
    }

    return (
        <div>
            {country.name.common}
            <ButtonShowHidden onClick={handleShowClick} show={show} />
            {show && <CountryInfo country={country} />}
        </div>
    )
}

function ButtonShowHidden({ onClick, show }) {
    return (<button onClick={onClick} style={{marginLeft: "10px"}}>
        {show ? "Hidden" : "Show"}
    </button>)
}