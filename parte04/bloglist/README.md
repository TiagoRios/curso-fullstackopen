<h1 style="text-align: center; color: blue; font-weight:bold">Blog List</h1>

<div style="display: flex; gap: 10px; justify-content:center">

![Static badge](https://img.shields.io/badge/express-v.4.18.2-blue)

</div>

## Run the project:

<ol>
    <li>clone this project.</li>
    <li>Create an account on MongoDB Atlas.</li>
    <li>configure a database on MongoDB Atlas.</li>
    <li>Copy the MongoDB Atlas connection url.</li>
</ol>

### Defining .env file

create a ".env" file in the project root and add the environment variable with the connection url:

```.env
MONGODB_URI=mongodb+srv://tiago:<password>@cluster0.xssg27f.mongodb.net/<your-DB-Name>?retryWrites=true&w=majority
```

### Without defining the ".env" file, using CLI:

```bash
node app.js MONGODB_URI=´mongodb+srv://tiago:<password>@cluster0.xssg27f.mongodb.net/<your-DB-Name>?retryWrites=true&w=majority´
```