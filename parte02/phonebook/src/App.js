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

    let handleNewMessage = (message) => {
        setNewMessage(message)
    }

    let handleInputFilterPersonsChange = (event) => {
        updateStates(persons, event.target.value)
        setInputFilterPersons(event.target.value);
    }

    let handleDeletePerson = (updatedPerson) => {
        let updatedPersonsArray = persons.filter(person => person.id !== updatedPerson.id) // Delete person
        updateStates(updatedPersonsArray, inputFilterPersons)

        console.log(`"${capitalize(updatedPerson.name)}" deleted.`);
        messageDiplayTimeout(`"${capitalize(updatedPerson.name)}" deleted.`, setNewMessage, 5000);
    }

    let handleUpdateNumber = (updatedPerson) => {
        let updatedPersonsArray = persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson) // Update person numbers
        updateStates(updatedPersonsArray, inputFilterPersons)

        console.log(`Updated "${capitalize(updatedPerson.name)}" numbers.`);
        messageDiplayTimeout(`Updated "${capitalize(updatedPerson.name)}" numbers.`, setNewMessage, 5000);
    }

    let handleSubmit = (event) => {
        event.preventDefault();
        let personFound = persons.find(p => p.name.toLowerCase() === newName.toLowerCase());

        // Person doesn't exist. CREATE new Person.
        if (!personFound) {
            let newPerson = { name: newName, numbers: [newNumber] };

            personServiceCreate(newPerson, persons, inputFilterPersons)
        }

        // Person exist.
        if (personFound) {
            let confirmed = window.confirm(`Person "${capitalize(newName)}" is already added to phonebook. Update current number to: ${newNumber}?`)

            if (confirmed) {
                // Remove number from the list and add it to the end of the list.
                let personWithUpdatedNumbers = {
                    ...personFound,
                    numbers: [...personFound.numbers.filter(n => n !== newNumber), newNumber]
                }

                personServiceUpdate(personWithUpdatedNumbers, persons, inputFilterPersons);
            }
        }
    };

    let updateStates = (personsArray, textToFilter) => {
        setNewNumber("");
        setPersons(personsArray);
        setFilteredPersons(filterPersons(personsArray, textToFilter));
    }

    const filterPersons = (personsArray, textToFilter) => {
        return personsArray.filter((person) => {
            return person.name.toLowerCase().includes(textToFilter.toLowerCase())
        });
    }

    const personServiceCreate = (newObject, persons, textToFilter) => {
        personService
            .create(newObject)
            .then(data => {
                let updatedPersonsArray = persons.concat(data); // adds new object at the end.
                updateStates(updatedPersonsArray, textToFilter);

                console.log(`Info: "${newObject.name}" added.`);
                messageDiplayTimeout(`"${newObject.name}" added.`, setNewMessage, 5000);
            }).catch(error => {
                console.log(`Error: ${error.response.statusText} - ${error.message}`);
                messageDiplayTimeout(`Error: ${error.response.statusText} - ${error.message}`, setNewMessage, 5000);
            })
    }

    const personServiceUpdate = (updatedPerson, persons, textToFilter) => {
        personService
            .update(updatedPerson.id, updatedPerson) // Update person.
            .then(() => {
                let newNumbers = updatedPerson.numbers;
                let oldNumbers = persons.find(p => p.id === updatedPerson.id).numbers;
                let updatedPersonsArray = persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson)

                updateStates(updatedPersonsArray, textToFilter)
                messageDiplayTimeout(`Updated number "${oldNumbers[oldNumbers.length - 1]}" to ${newNumbers[newNumbers.length - 1]}.`, setNewMessage, 5000);

            }).catch(error => {
                console.log(`Error: ${error.response.statusText} - ${error.message}`);
                messageDiplayTimeout(`Error: it was not possible to update. please refresh the page.`,
                    handleNewMessage, 5000)
            })
    }

    return (
        <div>
            <h1>Phonebook</h1>

            <Notification message={newMessage} />

            <h2>Add new person</h2>
            <PersonForm
                newName={newName}
                newNumber={newNumber}
                handleSubmit={handleSubmit}
                handleNewNameChange={handleNewNameChange}
                handleNewNumberChange={handleNewNumberChange}
            />

            {persons.length > 0 && <>
                <h2>Persons List</h2>

                <PersonsFilter
                    text="Filter person by name"
                    value={inputFilterPersons}
                    onChange={handleInputFilterPersonsChange} />

                <PersonsList
                    persons={filteredPersons}
                    handleNewMessage={handleNewMessage}
                    onDeletePerson={handleDeletePerson}
                    onUpdateNumber={handleUpdateNumber} />
            </>}
        </div>
    );
}