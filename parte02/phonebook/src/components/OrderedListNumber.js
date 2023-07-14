// Extra component that renders the list of contact numbers
// It is not part of the exercises.

import personService from "../services/personService"
import { messageDiplayTimeout } from "../utils"

export default function OrderedListNumbers({ person, onUpdateNumber, handleNewMessage }) {
    let lastNumber = person.numbers[person.numbers.length - 1];
    return (
        <ol style={{ marginTop: "0" }}>
            {
                person.numbers.map((number) => {
                    return (
                        <li key={number} style={{ marginLeft: "20px" }} >
                            <span style={(lastNumber === number) ? { fontWeight: "bold", color: "green" } : {}}>
                                {(lastNumber === number) ? `Current (${number})` : number}
                            </span> <UpdateNumberButton
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
                })
            }
        </ol>
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
                    console.log(`Error: ${error.response.statusText} - ${error.message}`);
                    messageDiplayTimeout(`Error: Person has already been deleted. please refresh the page.`,
                        handleNewMessage, 5000)
                })
        }
    }

    return (
        <button onClick={confirmDelete}>{textButton}</button>
    )
}

function UpdateNumberButton({ textButton, number, person, onUpdateNumber, handleNewMessage }) {
    let confirmUpdate = () => {
        let confirmed = window.confirm(`Edit number: ${number}?`)

        if (confirmed) {
            let stringNumber = window.prompt("please edit the number:", number)
            if (stringNumber === "" || stringNumber === undefined || stringNumber === null || stringNumber.length < 3) { // other check
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
                        console.log(`Error: ${error.response.statusText} - ${error.message}`);
                        messageDiplayTimeout(`Error: it was not possible to update. please refresh the page.`,
                            handleNewMessage, 5000)
                    })
            }
        }
    }

    return (
        <button onClick={confirmUpdate}>{textButton}</button>
    )
}