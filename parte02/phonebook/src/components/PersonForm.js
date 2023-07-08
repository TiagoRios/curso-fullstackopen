export default function PersonForm(props) {
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