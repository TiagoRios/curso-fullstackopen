import React, { useState } from 'react';

export default function App() {
    const anecdotes = [
        'Se fazer algo dói, faça isso com mais frequência.',
        'Contratar mão de obra para um projeto de software que já está atrasado, faz com que se atrase mais ainda!',
        'Os primeiros 90% do código correspondem aos primeiros 10% do tempo de desenvolvimento... Os outros 10% do código correspondem aos outros 90% do tempo de desenvolvimento.',
        'Qualquer tolo escreve código que um computador consegue entender. Bons programadores escrevem código que humanos conseguem entender.',
        'Otimização prematura é a raiz de todo o mal.',
        'Antes de mais nada, depurar é duas vezes mais difícil do que escrever o código. Portanto, se você escrever o código da forma mais inteligente possível, você, por definição, não é inteligente o suficiente para depurá-lo.',
        'Programar sem o uso extremamente intenso do console.log é o mesmo que um médico se recusar a usar raio-x ou testes sanguíneos ao diagnosticar pacientes.',
        'A única maneira de ir rápido é ir bem.',
        'Vem comigo que é sucesso!'
    ]

    const [selected, setSelected] = useState(0)
    const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

    let handleSelectedClick = () => {
        setSelected(Math.floor(Math.random() * anecdotes.length))
    }

    let handleVotesClick = () => {
        let votesCopy = votes.slice();
        votesCopy[selected] += 1;
        setVotes(votesCopy)
    }

    return (
        <div>
            <Header>Anecdote of the day</Header>
            <Anecdote anecdote={anecdotes[selected]} vote={votes[selected]} />

            <Button value="Vote" onClick={handleVotesClick} />
            <Button value="Next anecdote" onClick={handleSelectedClick} />

            <Header text="Anecdote with most votes" />
            <AnecdoteMostVoted anecdotes={anecdotes} votes={votes} />
        </div>
    )
}

function Header({ text, children }) {
    return children ? <h1>{children}</h1> : <h1>{text}</h1>
}

function Button({ value, onClick }) {
    return <button
        style={{ fontSize: "1.5rem", marginRight:"10px" }}
        onClick={onClick}>{value}</button>;
}

function Anecdote({ anecdote, vote }) {
    return (
        <div>
            <p>{anecdote}</p>
            <p>Has {vote} votes</p>
        </div>
    )
}

function AnecdoteMostVoted({ anecdotes, votes }) {
    return (
        <div>
            {Math.max(...votes) !== 0 ?
                <>
                    <p>{anecdotes[votes.indexOf(Math.max(...votes))]}</p>
                    <p>Has {Math.max(...votes)} votes</p>
                </> : <p>Anecdotes without votes.</p>
            }
        </div>
    )
}