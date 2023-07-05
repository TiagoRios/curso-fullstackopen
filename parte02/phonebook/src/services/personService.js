import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
    return axios
        .get(baseUrl)
        .then(res => res.data);
}

const create = (newObject) => {
    return axios
        .post(baseUrl, newObject)
        .then(res => res.data);
}

const update = (id, newObject) => {
    return axios
        .put(`${baseUrl}/${id}`, newObject)
        .then(res => res.data);
}

const deletee = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const personService = { getAll, create, update, deletee }

export default personService;