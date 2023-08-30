export default function PersonForm(props) {
    return (
        <form className="container" style={{flexDirection:"column"}} onSubmit={props.handleSubmit}>
            <div className="container-wrap flex-space-between">
                <label htmlFor="name">Name: </label>
                <input id="name"
                    type="text"
                    value={props.newName}
                    onChange={props.handleNewNameChange}
                    required="required"
                    placeholder="Name" />
            </div>
            <div className="container-wrap flex-space-between">
                <label htmlFor="phoneNumber">Number: </label>
                <input id="phoneNumber"
                    type="tel"
                    value={props.newNumber}
                    onChange={props.handleNewNumberChange}
                    required="required"
                    minLength="3"
                    placeholder="01-23-4567890" />
            </div>

            <button className="btn sucess" type="submit">add</button>

        </form>
    );
}