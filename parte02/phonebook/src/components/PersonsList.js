import personService from "../services/personService"
import NumbersList from "./NumbersList"

import { messageDisplayTimeout } from "../utils"

export default function PersonsList({ persons, onDeletePerson, onUpdateNumber, handleNewMessage }) {
    return (<div className='container flex-column' style={{ minWidth: "330px" }} >
        {persons.map((person) =>
            <PersonDetails
                key={person.id}
                person={person}
                onDeletePerson={onDeletePerson}
                onUpdateNumber={onUpdateNumber}
                handleNewMessage={handleNewMessage}
            />)}
    </div>
    )
}

function PersonDetails({ person, onDeletePerson, onUpdateNumber, handleNewMessage }) {
    return (
        <details>
            <summary>
                {person.name} <DeletePersonButton
                    textButton="Delete"
                    person={person}
                    onDeletePerson={onDeletePerson}
                    handleNewMessage={handleNewMessage} />
            </summary>

            <div style={{ padding: "5px" }}>
                id: {person.id} <br />
                Current Number: {person.numbers[person.numbers.length - 1]}<br />
                All Numbers:
                <NumbersList
                    person={person}
                    onUpdateNumber={onUpdateNumber}
                    handleNewMessage={handleNewMessage} />
            </div>
        </details>
    )
}

function DeletePersonButton({ textButton, person, onDeletePerson, handleNewMessage }) {
    let confirmDelete = () => {
        let confirmed = window.confirm(`Delete ${person.name}?`)

        if (confirmed) {
            personService
                .deletee(person.id) // Delete person.
                .then(() => {
                    onDeletePerson(person, "delete");
                }).catch(error => {
                    console.log(`Error: ${error.response.statusText} - ${error.message}`);
                    messageDisplayTimeout(`Error: Person has already been deleted. please refresh the page.`,
                        handleNewMessage, 5000)
                })
        }
    }

    return <button className="btn danger" onClick={confirmDelete}>{textButton}</button>
}