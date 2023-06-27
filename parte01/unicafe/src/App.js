import React, { useState } from 'react';

export default function App() {
    // salve os cliques de cada botão em seu próprio estado
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            Programe aqui!
        </div>
    )
}