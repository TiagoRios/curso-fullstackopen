import React, { useEffect, useState } from 'react';

import personService from './services/personService';

export default function App() {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [filteredPersons, setFilteredPersons] = useState([]);
    const [inputFilterPersons, setInputFilterPersons] = useState("");

    useEffect(() => {
        personService.getAll().then((data) => {
            setPersons(data)
            setFilteredPersons(data)
        });
    }, []);

    let handleNewNameChange = (event) => {
        setNewName(capitalize(event.target.value));
    };

    let handleNewNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    let handleInputFilterPersonsChange = (event) => {
        let eventValue = event.target.value;
        let filteredPersons = findAllPersons(persons, eventValue);

        (eventValue === "") ?
            setFilteredPersons(persons) :
            setFilteredPersons(filteredPersons);

        setInputFilterPersons(eventValue);
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        let objectPersonFound = findPerson(persons, newName) || {};
        let numberFound = "";

        let isFilledObject = Object.keys(objectPersonFound).length !== 0;

        if (isFilledObject) {
            numberFound = findNumber(objectPersonFound.numbers, newNumber);
        }

        // Person doesn't exist. CREATE new Person.
        if (!isFilledObject && newName !== "" && newNumber !== "") {
            let newObject = {
                name: newName,
                numbers: [newNumber],
            };

            personService
                .create(newObject)
                .then(data => {
                    setPersons(persons.concat(data));
                    setFilteredPersons(persons.concat(data));
                    setNewName("");
                    setNewNumber("");
                    setInputFilterPersons("");
                });

            alert(`Person "${capitalize(newName)}" added.`);
        }

        // Person exist and number exist. ALERT message.
        if ((isFilledObject) && (numberFound.length > 0)) {
            alert(`Person "${capitalize(newName)}" with phone "${newNumber}" is already added to phonebook`);
        }
        // Person exist, BUT number doesn't exist. UPDATE Person with new NUMBER
        else if (isFilledObject) {

            let updatedPerson = {
                ...objectPersonFound,
                numbers: objectPersonFound.numbers.concat(newNumber)
            };

            personService
                .update(objectPersonFound.id, updatedPerson)
                .then(data => {
                    let updatedPersonsArray = persons.map(p => p.id !== objectPersonFound.id ? p : data);
                    setPersons(updatedPersonsArray)
                    setFilteredPersons(updatedPersonsArray);
                    setNewNumber("");
                    setInputFilterPersons("");
                    alert(`Person "${capitalize(newName)}" updated.`);
                });
        }
    };

    let updateAfterDeletePerson = (updatedPerson) => {
        let updatePersons = persons.filter(p => p.id !== updatedPerson.id)
        setPersons(updatePersons);
        setFilteredPersons(updatePersons);
    }

    let updatePersonNumbers = (updatedPerson) => {
        let updatedPersons = [...persons.filter(p => p.id !== updatedPerson.id), updatedPerson]
        setPersons(updatedPersons);
        setFilteredPersons(updatedPersons);
    }

    return (
        <div>
            <HeaderH2 value="Phonebook" />

            <HeaderH3 value="Add new person or new numbers" />
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

            <PersonsList
                persons={filteredPersons}
                updateOnDeletePerson={updateAfterDeletePerson}
                updatePersonNumbers={updatePersonNumbers} />
        </div>
    );
}


/* ==========================================================
                            Components
   ========================================================== */


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
                    minLength="3"
                    placeholder="01-23-4567890" />
            </div>

            <button type="submit">add</button>

        </form>
    );
}

function PersonsList({ persons, updateOnDeletePerson, updatePersonNumbers }) {
    return (
        persons.map((person) =>
            <PersonDetails
                key={person.id}
                person={person}
                updateOnDeletePerson={updateOnDeletePerson}
                updatePersonNumbers={updatePersonNumbers}
            />)
    )
}

function PersonDetails({ person, updateOnDeletePerson, updatePersonNumbers }) {
    return (
        <details>
            <summary>
                {person.name} <DeletePersonButton textButton="Delete" person={person} updateOnDelete={updateOnDeletePerson} />
            </summary>

            <div style={{ padding: "5px" }}>
                id: {person.id} <br />
                Numbers:
                <OrderedListNumbers person={person} updatePersonNumbers={updatePersonNumbers} />
            </div>
        </details>
    )
}

function OrderedListNumbers({ person, updatePersonNumbers }) {
    return (
        <ol style={{ marginTop: "0" }}>
            {
                person.numbers.map((number) => {
                    return (
                        <li key={number} style={{ marginLeft: "20px" }} >
                            {number} <UpdateNumberButton
                                textButton="Update"
                                number={number}
                                person={person}
                                updateOnUpdate={updatePersonNumbers} />
                            {(person.numbers.length > 1) && <DeleteNumberButton
                                textButton="Del"
                                number={number}
                                person={person}
                                updateOnDelete={updatePersonNumbers} />
                            }
                        </li>
                    )
                })
            }
        </ol>
    )
}

function DeletePersonButton({ textButton, person, updateOnDelete }) {
    let confirmDelete = () => {
        let confirmed = window.confirm(`Delete ${person.name}?`)
        if (confirmed) {
            personService
                .deletee(person.id)
                .then(() => {
                    updateOnDelete(person);
                    console.log("Delete Sucess.\n",)
                })
                .catch((err) => console.log("Fail Delete!!\n", err))
        }

    }

    return <button onClick={confirmDelete}>{textButton}</button>
}

function DeleteNumberButton({ textButton, number, person, updateOnDelete }) {
    let confirmDelete = () => {
        let confirmed = window.confirm(`Delete number: ${number}?`)
        if (confirmed) {
            let updatedPersonNumbers = {
                ...person,
                numbers: person.numbers.filter(num => num !== number) // delete number.
            };

            personService
                .update(person.id, updatedPersonNumbers)
                .then(() => {
                    updateOnDelete(updatedPersonNumbers)
                }).catch(err => console.log("Error::: ", err))
        }

    }

    return (
        <button onClick={confirmDelete}>{textButton}</button>
    )
}

function UpdateNumberButton({ textButton, number, person, updateOnUpdate }) {
    let confirmUpdate = () => {
        let confirmed = window.confirm(`Update number: ${number}?`)
        if (confirmed) {
            let stringNumber = window.prompt("please enter a new number:")
            if (stringNumber === "" || stringNumber === undefined || stringNumber === null || stringNumber.length < 3) { // other checks
                window.alert("Provide a valid phone number.")
            } else {
                let updatedPersonNumbers = {
                    ...person,
                    numbers: [...person.numbers.filter(num => num !== number), stringNumber] // delete number.
                };

                personService
                    .update(person.id, updatedPersonNumbers)
                    .then(() => {
                        updateOnUpdate(updatedPersonNumbers)
                    }).catch(err => console.log("Erro:: ", err))
            }
        }
    }

    return (
        <button onClick={confirmUpdate}>{textButton}</button>
    )
}

/* ==========================================================
                               Utils
   ========================================================== */


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

function findPerson(personsArr, name) {
    return personsArr.find(x => x.name.toLowerCase() === name.toLowerCase());
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