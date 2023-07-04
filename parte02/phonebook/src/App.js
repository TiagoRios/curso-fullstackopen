import React, { useState, useEffect } from 'react';

export default function App() {
    const [persons, setPersons] = useState([
        { name: 'I', numbers: ['111', "222", "333", "444"], id: 5 },
        { name: 'Arto Hellas', numbers: ["01-12-2334455", "11-11-1111111"], id: 1 },
        { name: 'you', numbers: ['99-99-9999999', "88-88-8888888"], id: 6 },
        { name: 'Ada Lovelace', numbers: ['39-44-5323523', "22-22-2222222"], id: 2 },
        { name: 'Dan Abramov', numbers: ['12-43-234345', "33-33-3333333"], id: 3 },
        { name: 'Mary Poppendieck', numbers: ['39-23-6423122', "44-44-4444444"], id: 4 },
    ]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [filteredPersons, setFilteredPersons] = useState([]);
    const [inputFilterPersons, setInputFilterPersons] = useState("");

    useEffect(() => {
        setFilteredPersons(persons);
    }, [persons])

    let handleNewNameChange = (event) => {
        setNewName(capitalize(event.target.value));
    };

    let handleNewNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    let handleSubmit = (event) => {
        event.preventDefault();
        let personFound = findPersonByName(persons, newName);
        let numberFound = "";

        if (personFound !== []) {
            numberFound = findNumber(personFound[0]?.numbers, newNumber);
        }

        // Person doesn't exist. CREATE new Person.
        if (personFound.length === 0 && newName !== "" && newNumber !== "") {
            let newObject = {
                id: nextPersonId(persons),
                name: newName,
                numbers: [newNumber],
            };
            setPersons(persons.concat(newObject));
            setNewName("");
            setNewNumber("");
            setInputFilterPersons("");
            alert(`Person "${capitalize(newName)}" added.`);
        }

        // Person exist and number exist. ALERT message.
        // else if
        // Person exist, BUT number doesn't exist. UPDATE Person with new NUMBER
        if ((personFound.length > 0) && (numberFound.length > 0)) {
            alert(`Person "${capitalize(newName)}" with phone "${newNumber}" is already added to phonebook`);

        } else if (personFound.length > 0) {

            let OtherPersons = findOtherPersons(persons, newName);

            let updatedPerson = {
                id: personFound[0].id,
                name: personFound[0].name,
                numbers: personFound[0].numbers.concat(newNumber)
            };

            setPersons([...OtherPersons, updatedPerson]);
            setNewNumber("");
            setInputFilterPersons("");
            alert(`Person "${capitalize(newName)}" updated.`);
        }
    };

    let handleInputFilterPersonsChange = (event) => {
        let eventValue = event.target.value;
        let filteredPersons = findAllPersons(persons, eventValue);

        if (eventValue === "") {
            setFilteredPersons(persons);
        } else {
            setFilteredPersons(filteredPersons);
        }

        setInputFilterPersons(eventValue);
    }

    return (
        <div>
            <HeaderH2 value="Phonebook" />

            <HeaderH3 value="Add new person" />
            <PersonForm
                newName={newName}
                newNumber={newNumber}
                handleSubmit={handleSubmit}
                handleNewNameChange={handleNewNameChange}
                handleNewNumberChange={handleNewNumberChange}
            />

            <HeaderH3 value="Persons List" />

            <PersonsFilter
                text="Filter person by name"
                value={inputFilterPersons}
                onChange={handleInputFilterPersonsChange} />

            <PersonsList persons={filteredPersons} />
        </div>
    );
}

function HeaderH2({ value }) {
    return <h1>{value}</h1>
}

function HeaderH3({ value }) {
    return <h2>{value}</h2>
}

function PersonsFilter({ text, onChange, value }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <label htmlFor="filter">{text}: </label>
            <input id="filter" type='text' value={value} onChange={onChange} />
        </div>
    )
}

function PersonForm(props) {
    return (
        <form onSubmit={props.handleSubmit}>
            <div>
                <label htmlFor="name">Name: </label>
                <input id="name"
                    type="text"
                    value={props.newName}
                    onChange={props.handleNewNameChange}
                    required
                    placeholder="Name" />
            </div>
            <div>
                <label htmlFor="phoneNumber">Number: </label>
                <input id="phoneNumber"
                    type="tel"
                    value={props.newNumber}
                    onChange={props.handleNewNumberChange}
                    required
                    placeholder="01-23-4567890" />
            </div>

            <button type="submit">add</button>

        </form>
    );
}

function PersonsList({ persons }) {
    return (
        persons.map((person) =>
            <PersonDetails key={person.name} person={person} />)
    )
}

function PersonDetails({ person }) {
    return (
        <details>
            <summary>{person.name}</summary>

            <div style={{ padding: "5px" }}>

                id: {person.id} <br />
                Numbers:
                <ol style={{ marginTop: "0" }}>
                    {
                        person.numbers.map((x) => {
                            return <li style={{ marginLeft: "20px" }} key={x}>{x}</li>
                        })
                    }
                </ol>
            </div>
        </details>
    )
}

/* ============================ Utils ========================= */

/**
 * Capitalize the string.
 * 
 * @param {String} str String to capitalize. 
 * @returns String capitalized.
 */
function capitalize(str) {
    return str.split(" ")
        .map(word => word[0]?.toUpperCase().concat(word.slice(1)))
        .join(" ");
}

/**
 * Finds all persons that match the name fragment.
 * 
 * @param {String} name name fragment to fetch. 
 * @returns array with all persons that match the search
 */
function findAllPersons(personsArr, name) {
    return personsArr.filter((x) =>
        x.name.toLowerCase().includes(name.toLowerCase())
    );
}

/**
 * Find number.
 * 
 * @param {*} numbersArr Array to filter.
 * @param {String} number number to search.
 * @returns {String} string with the number or empty string.
 */
function findNumber(numbersArr, number) {
    return numbersArr?.filter(a => a === number).join("");
}

/**
 * Find one person by their exact name.
 * 
 * @param {person[]} personsArr Array to filter.
 * @param {String} name name of person.
 * @returns {person[]} Array with the person or empty array.
 */
function findPersonByName(personsArr, name) {
    return personsArr?.filter(x => x.name.toLowerCase() === name.toLowerCase());
}

/**
 * Finds all Persons except the given person name.
 * 
 * @param {Array} personArr Array to filter.
 * @param {String} name person name to not fetched.
 * @returns Array with the other persons.
 */
function findOtherPersons(personArr, name) {
    return personArr.filter(x => x.name.toLowerCase() !== name.toLowerCase())
}

/**
 * Find the next available id.
 * 
 * @param {Array} personArr Array to search id.
 * @returns {number} next integer.
 */
function nextPersonId(personArr) {
    return Math.max(...personArr.map((person) => person.id)) + 1;
}