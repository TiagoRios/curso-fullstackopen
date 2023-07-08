export default function PersonsFilter({ text, onChange, value }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <label htmlFor="filter">{text}: </label>
            <input id="filter" type='text' value={value} onChange={onChange} />
        </div>
    )
}