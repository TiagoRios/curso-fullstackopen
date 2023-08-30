export default function PersonsFilter({ text, onChange, value }) {
    return (
        <div className="container-wrap flex-column-center" style={{ marginBottom: "10px"}}>
            <label htmlFor="filter">{text}: </label>
            <input id="filter" type='text' value={value} onChange={onChange} />
        </div>
    )
}