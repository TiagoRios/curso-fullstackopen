// Extra component that renders the list of contact numbers
// It is not part of the exercises.

import personService from "../services/personService"
import { messageDisplayTimeout } from "../utils"

export default function NumbersList({ person, onUpdateNumber, handleNewMessage }) {
    return (
        <ol style={{ marginTop: "0" }}>
            {person.numbers.map((number) => (
                <PhoneNumber
                    key={number}
                    person={person}
                    number={number}
                    onUpdateNumber={onUpdateNumber}
                    handleNewMessage={handleNewMessage}
                />))}
        </ol>
    )
}

function PhoneNumber({ person, number, onUpdateNumber, handleNewMessage }) {
    let lastNumber = person.numbers[person.numbers.length - 1];
    return (
        <li>
            <span style={(lastNumber === number) ? { fontWeight: "bold", color: "green" } : {}}>
                {(lastNumber === number) ? `New (${number})` : `Old - ${number}`}
            </span> <EditNumberButton
                textButton="Edit"
                number={number}
                person={person}
                onUpdateNumber={onUpdateNumber}
                handleNewMessage={handleNewMessage} />

            {(person.numbers.length > 1) && <DeleteNumberButton
                textButton="Del"
                number={number}
                person={person}
                onDeleteNumber={onUpdateNumber}
                handleNewMessage={handleNewMessage} />
            }
        </li>
    )
}

function DeleteNumberButton({ textButton, number, person, onDeleteNumber, handleNewMessage }) {
    let confirmDelete = () => {
        let confirmed = window.confirm(`Delete number: ${number}?`)

        if (confirmed) {
            let personWithUpdatedNumbers = {
                ...person,
                numbers: person.numbers.filter(num => num !== number) // delete number.
            };

            personService
                .update(personWithUpdatedNumbers.id, personWithUpdatedNumbers) // Update person.
                .then(() => {
                    onDeleteNumber(personWithUpdatedNumbers, "delete")
                }).catch(error => {
                    let errorResponse = error.response;
                    let errorMessage = `Error: ${errorResponse.statusText} - ${errorResponse.data.error.message}`;

                    messageDisplayTimeout(errorMessage, handleNewMessage, 5000)
                })
        }
    }

    return (
        <button className="btn warning" onClick={confirmDelete}>{textButton}</button>
    )
}

function EditNumberButton({ textButton, number, person, onUpdateNumber, handleNewMessage }) {
    let confirmUpdate = () => {
        let confirmed = window.confirm(`Edit number: ${number}?`)

        if (confirmed) {
            let stringNumber = window.prompt("please edit the number:", number)
            if (stringNumber === "" || stringNumber === undefined || stringNumber === null || stringNumber.length < 8) { // other check
                window.alert("Provide a valid phone number.")
            } else if (person.numbers.filter(p => p === stringNumber).length >= 1) {
                window.alert(`Number ${stringNumber} already exists in the list.`)
            } else {
                let personWithUpdatedNumbers = {
                    ...person,
                    numbers: person.numbers.map(num => num !== number ? num : stringNumber) // update number.
                };

                personService
                    .update(personWithUpdatedNumbers.id, personWithUpdatedNumbers) // Update person.
                    .then(() => {
                        onUpdateNumber(personWithUpdatedNumbers, "update")
                    }).catch(error => {
                        let errorResponse = error.response;
                        let errorMessage = `Error: ${errorResponse.statusText} - ${errorResponse.data.error.message}`;

                        messageDisplayTimeout(errorMessage, handleNewMessage, 5000)
                    })
            }
        }
    }

    return (
        <button className="btn black" onClick={confirmUpdate}>{textButton}</button>
    )
}