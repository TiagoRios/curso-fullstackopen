import mongoose from 'mongoose';

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const URL = `mongodb+srv://tiago:${password}@cluster0.xssg27f.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(URL);

const personScheme = new mongoose.Schema({ name: String, numbers: [] })

const Person = mongoose.model('person', personScheme)

if (process.argv.length === 5) {

    let person = new Person({
        name: process.argv[3],
        numbers: process.argv[4]
    })

    person.save()
        .then(r => {
            console.log("\nSave sucess!")
            console.log(`Added ${person.name} number ${person.numbers[0]} to phonebook\n`)
        }).catch((error) => {
            console.log("Error: ", error.message)
        }).finally(x => {
            mongoose.connection.close();
        })

} else if (process.argv.length === 3) {

    Person.find({}).then(persons => {
        // throw new Error("Error message here!")
        console.log("\nphonebook:");
        persons.forEach(person => {
            console.log(`${person.name} ${person.numbers.map((x, index) => (`N${index + 1}(${x})`)).join(" ")}`)
        });
        console.log(`\nRegisters: ${persons.length} contact(s)\n`);
    }).catch((error) => {
        console.log("Error: ", error.message)
    }).finally(() => {
        mongoose.connection.close();
    })
}