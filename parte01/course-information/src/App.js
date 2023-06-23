import React from 'react';

export default function App() {

    const course = 'Desenvolvimento de aplicação Half Stack'
    const part1 = 'Fundamentos da biblioteca React'
    const exercises1 = 10
    const part2 = 'Usando props para passar dados'
    const exercises2 = 7
    const part3 = 'Estado de um componente'
    const exercises3 = 14

    return (
        <div>
            <Header course={course}></Header>

            <Content part={part1} exercises={exercises1}></Content>
            <Content part={part2} exercises={exercises2}></Content>
            <Content part={part3} exercises={exercises3}></Content>

            <Total>{exercises1 + exercises2 + exercises3}</Total>
        </div>
    )
}

function Header({ course }) {
    return (<h1>{course}</h1>);
}

function Content(props) {
    // return (<p>{part} - {exercises}</p>) // simples
    return (<Part {...props}></Part>);
}

function Total({children}) {
    return (<p>Number of exercises {children}</p>)
}

function Part({part, exercises}){
    return (<p>{part} - {exercises}</p>);
}