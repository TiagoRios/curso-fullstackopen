import React from 'react';

export default function App() {
    let corTexto = { color: "red" };

    return (
        <>
            <h1>Molde para os novos projetos</h1>
            <ul>
                <li style={corTexto}>Mude o nome do projeto nos arquivos package*.json</li>
                <li style={corTexto}>Mude o nome do projeto em public/index.html</li>
            </ul>
        </>
    )
}