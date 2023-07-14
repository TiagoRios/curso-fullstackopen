export default function FilterInput({ value, onChange }) {
    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="find-country">find countries: </label>
            <input
                type="text"
                id="find-country"
                name="find-country"
                value={value}
                onChange={onChange}
            />
        </form>
    )
}