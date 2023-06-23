import React from 'react';

export default function App() {

    const course = {
        name: 'Desenvolvimento de aplicação Half Stack',
        parts: [
            {
                name: 'Fundamentos da biblioteca React',
                exercises: 10
            },
            {
                name: 'Usando props para passar dados',
                exercises: 7
            },
            {
                name: 'Estado de um componente',
                exercises: 14
            }
        ]
    }

    return (
        <div>
            <Header course={course.name} />

            <ContentList parts={course.parts} />

            <Total parts={course.parts} />
        </div>
    )
}

/* ========================= Header =========================== */

function Header({ course }) {
    return (<h1>{course}</h1>);
}

/* ========================= Content ========================== */

function ContentList({ parts }) {
    const arrList = parts.map((part, index) => {
        return <li key={index}><Content part={part} /></li>
    })

    return (
        <ul>{arrList}</ul>
    )
}

function Content(props) {
    return (<Part {...props}></Part>);
}

function Part({ part }) {
    return (<>{part.name} - {part.exercises}</>);
}

/* ========================= Total ============================ */

function Total({ parts }) {
    const arrTotal = parts.reduce((anterior, atual) => {
        return anterior += atual.exercises
    }, 0)

    return (<p>Number of exercises {arrTotal}</p>)
}