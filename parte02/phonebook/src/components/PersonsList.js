import personService from "../services/personService"
import { messageDiplayTimeout } from "../utils"

export default function PersonsList({ persons, onUpdatePersons, handleNewMessage }) {
    return (
        persons.map((person) =>
            <PersonDetails
                key={person.id}
                person={person}
                onUpdatePersons={onUpdatePersons}
                handleNewMessage={handleNewMessage}
            />)
    )
}

function PersonDetails({ person, onUpdatePersons, handleNewMessage }) {
    return (
        <details>
            <summary>
                {person.name} <DeletePersonButton
                    textButton="Delete"
                    person={person}
                    onDeletePersons={onUpdatePersons}
                    handleNewMessage={handleNewMessage} />
            </summary>

            <div style={{ padding: "5px" }}>
                id: {person.id} <br />
                Numbers:
                <OrderedListNumbers
                    person={person}
                    onUpdatePersons={onUpdatePersons}
                    handleNewMessage={handleNewMessage} />
            </div>
        </details>
    )
}

function OrderedListNumbers({ person, onUpdatePersons, handleNewMessage }) {
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
                                onUpdateNumbersPerson={onUpdatePersons}
                                handleNewMessage={handleNewMessage} />
                            {(person.numbers.length > 1) && <DeleteNumberButton
                                textButton="Del"
                                number={number}
                                person={person}
                                handleNewMessage={handleNewMessage}
                                onUpdateNumbersPerson={onUpdatePersons} />
                            }
                        </li>
                    )
                })
            }
        </ol>
    )
}

function DeletePersonButton({ textButton, person, onDeletePersons, handleNewMessage }) {
    let confirmDelete = () => {
        let confirmed = window.confirm(`Delete ${person.name}?`)

        if (confirmed) {
            personService
                .deletee(person.id) // Delete person.
                .then(() => {
                    console.log('Info: person deleted.');
                    onDeletePersons(person, "delete");
                }).catch(error => {
                    console.log(`Error: ${error.response.statusText} - ${error.message}`);
                    messageDiplayTimeout(`Error: Person has already been deleted. please refresh the page.`,
                        handleNewMessage, 5000)
                })
        }
    }

    return <button onClick={confirmDelete}>{textButton}</button>
}

function DeleteNumberButton({ textButton, number, person, onUpdateNumbersPerson, handleNewMessage }) {
    let confirmDelete = () => {
        let confirmed = window.confirm(`Delete number: ${number}?`)

        if (confirmed) {
            let personWithUpdatedNumber = {
                ...person,
                numbers: person.numbers.filter(num => num !== number) // delete number.
            };

            personService
                .update(personWithUpdatedNumber.id, personWithUpdatedNumber) // Update person.
                .then(() => {
                    onUpdateNumbersPerson(personWithUpdatedNumber, "update")
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

function UpdateNumberButton({ textButton, number, person, onUpdateNumbersPerson, handleNewMessage }) {
    let confirmUpdate = () => {
        let confirmed = window.confirm(`Update number: ${number}?`)

        if (confirmed) {
            let stringNumber = window.prompt("please edit the number:", number)
            if (stringNumber === "" || stringNumber === undefined || stringNumber === null || stringNumber.length < 3) { // other check
                window.alert("Provide a valid phone number.")
            } else {
                let personWithUpdatedNumber = {
                    ...person,
                    numbers: person.numbers.map(num => num !== number ? num : stringNumber) // update number.
                };

                personService
                    .update(personWithUpdatedNumber.id, personWithUpdatedNumber) // Update person.
                    .then(() => {
                        onUpdateNumbersPerson(personWithUpdatedNumber, "update")
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