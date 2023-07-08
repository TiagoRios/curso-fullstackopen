import React, { useEffect, useState } from 'react';

import PersonForm from './components/PersonForm';
import PersonsList from './components/PersonsList';
import Notification from './components/Notification';
import PersonsFilter from './components/PersonFilter';

import personService from "./services/personService";

import { capitalize, messageDiplayTimeout } from './utils';

export default function App() {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [newMessage, setNewMessage] = useState(null)
    const [filteredPersons, setFilteredPersons] = useState([]);
    const [inputFilterPersons, setInputFilterPersons] = useState("");

    useEffect(() => {
        personService.getAll().then((data) => {
            setPersons(data)
            setFilteredPersons(data)
            console.log("successfully retrieved data.");
        }).catch(error => {
            console.log(`Error: ${error.response.statusText} - ${error.message}`);

            messageDiplayTimeout(`Error: ${error.response.statusText} - ${error.message}`,
                setNewMessage, 5000);
        })

    }, []);

    let handleNewNameChange = (event) => {
        setNewName(capitalize(event.target.value));
    };

    let handleNewNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    let handleInputFilterPersonsChange = (event) => {
        updatePersonsAndFilteredPersons(persons, event.target.value)
        setInputFilterPersons(event.target.value);
    }

    let handleSubmit = (event) => {
        event.preventDefault();

        let numberFound = undefined;
        let personFound = persons.find(p => p.name.toLowerCase() === newName.toLowerCase());

        if (personFound) {
            numberFound = personFound.numbers?.find(num => num === newNumber);
        }

        // Person doesn't exist. CREATE new Person.
        if (!personFound) {
            let newObject = { name: newName, numbers: [newNumber] };

            personService
                .create(newObject)
                .then(data => {
                    let updatedPersonsArray = persons.concat(data);
                    updatePersonsAndFilteredPersons(updatedPersonsArray, inputFilterPersons);

                    console.log(`Info: "${newObject.name}" added.`);
                    messageDiplayTimeout(`Info: "${newObject.name}" added.`, setNewMessage, 5000);
                }).catch(error => {
                    console.log(`Error: ${error.response.statusText} - ${error.message}`);
                    messageDiplayTimeout(`Error: ${error.response.statusText} - ${error.message}`, setNewMessage, 5000);
                })
        }

        // Person exist and number exist. ALERT message.
        if (personFound && numberFound) {
            alert(`Person "${capitalize(newName)}" with phone "${newNumber}" is already added to phonebook`);
        }

        // Person exist, BUT number doesn't exist. UPDATE Person with new NUMBER
        else if (personFound) {
            let changedPerson = {
                ...personFound,
                numbers: personFound.numbers.concat(newNumber) // update numbers list.
            };

            personService
                .update(changedPerson.id, changedPerson)
                .then(data => {
                    let updatedPersonsArray = persons.map(p => p.id !== changedPerson.id ? p : data);
                    updatePersonsAndFilteredPersons(updatedPersonsArray, inputFilterPersons)

                    console.log(`Info: Added new number for "${capitalize(changedPerson.name)}".`);
                    messageDiplayTimeout(`Info: Added new number for "${capitalize(changedPerson.name)}".`, setNewMessage, 5000);
                }).catch(error => {
                    console.log(`Error: ${error.response.statusText} - ${error.message}`)
                    messageDiplayTimeout(`Error: ${error.response.statusText} - ${error.message}`, setNewMessage, 5000);
                })
        }
    };

    // type: "delete" or "update"
    let handleOnUpdatePersons = (updatedPerson, type) => {
        let updatedPersonsArray = [];

        if (type === "delete") {
            updatedPersonsArray = persons.filter(person => person.id !== updatedPerson.id) // Delete person
            updatePersonsAndFilteredPersons(updatedPersonsArray, inputFilterPersons)

            console.log(`"${capitalize(updatedPerson.name)}" deleted.`);
            messageDiplayTimeout(`"${capitalize(updatedPerson.name)}" deleted.`, setNewMessage, 5000);

        } else if (type === "update") {
            updatedPersonsArray = persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson) // Update person numbers
            updatePersonsAndFilteredPersons(updatedPersonsArray, inputFilterPersons)

            console.log(`Updated "${capitalize(updatedPerson.name)}" numbers.`);
            messageDiplayTimeout(`Updated "${capitalize(updatedPerson.name)}" numbers.`, setNewMessage, 5000);
        }
    }

    let updatePersonsAndFilteredPersons = (personsArray, textToFilter) => {
        let filteredArray = personsArray.filter((person) => {
            return person.name.toLowerCase().includes(textToFilter.toLowerCase())
        });
        setNewNumber("");
        setPersons(personsArray);
        setFilteredPersons(filteredArray);
    }

    let handleNewMessage = (message) => {
        setNewMessage(message)
    }

    return (
        <div>
            <h1>Phonebook</h1>

            <Notification message={newMessage} />

            <h2>Add new person or new numbers</h2>
            <PersonForm
                newName={newName}
                newNumber={newNumber}
                handleSubmit={handleSubmit}
                handleNewNameChange={handleNewNameChange}
                handleNewNumberChange={handleNewNumberChange}
            />

            <h2>Persons List</h2>

            <PersonsFilter
                text="Filter person by name"
                value={inputFilterPersons}
                onChange={handleInputFilterPersonsChange} />

            <PersonsList
                persons={filteredPersons}
                handleNewMessage={handleNewMessage} 
                onUpdatePersons={handleOnUpdatePersons} />
        </div>
    );
}