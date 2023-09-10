export default function PersonForm(props) {
    return (
        <form className="container" style={{ flexDirection: "column" }} onSubmit={props.handleSubmit}>
            <div className="container-wrap flex-space-between">
                <label htmlFor="name">Name: </label>
                <input id="name"
                    type="text"
                    value={props.newName}
                    onChange={props.handleNewNameChange}
                    required="required"
                    placeholder="Arto Hellas"
                    minLength="3" />
            </div>
            <div className="container-wrap flex-space-between">
                <label htmlFor="phoneNumber">Number: </label>
                <input id="phoneNumber"
                    type="tel"
                    value={props.newNumber}
                    onChange={props.handleNewNumberChange}
                    required="required"
                    minLength="8"
                    placeholder="12345678 / 012-12345678" />
            </div>

            <button className="btn sucess" type="submit">add</button>

        </form>
    );
}