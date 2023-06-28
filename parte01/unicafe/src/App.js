import React, { Fragment, useEffect, useState } from 'react';

export default function App() {
    // salve os cliques de cada botão em seu próprio estado
    const [bad, setBad] = useState(0)
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [isStatistics, setIsStatistics] = useState(false);

    const handleGoodClick = () => {
        setGood(good + 1);
        if (!isStatistics) setIsStatistics(true);
    }

    const handleNeutralClick = () => () => {
        setNeutral(neutral + 1);
        if (!isStatistics) setIsStatistics(true);
    }

    return (
        <div>
            <Feedback title="Give Feedback">
                <Button onClick={handleGoodClick} title="Good" style={{ backgroundColor: "green", color: "white" }} />
                <Button onClick={handleNeutralClick()} title="Neutral" />
                <Button
                    onClick={() => {
                        setBad(bad + 1);
                        if (!isStatistics) setIsStatistics(true);
                    }} title="Bad" style={{ backgroundColor: "red", color: "white" }} />
            </Feedback>

            <Statistics
                bad={bad}
                good={good}
                neutral={neutral}
                isStatistics={isStatistics}
            />
        </div >
    )
}

function Feedback({ children, title }) {
    return (
        <div>
            <Header title={title} style={{ color: "blue" }} />
            {children}
        </div>
    )
}

function Statistics(props) {
    let bad = props.bad;
    let good = props.good;
    let neutral = props.neutral;

    let feedbacks = good + bad + neutral;
    let amountFeedbackTypes = (good > 0 ? 1 : 0) + (bad > 0 ? 1 : 0) + (neutral > 0 ? 1 : 0);

    return (
        <div>
            <Header title="Statistics" style={{ color: "hotpink" }} />
            {!props.isStatistics ?
                <p>No feedback given!!!</p> :
                <Table {...props}
                    feedbacks={feedbacks}
                    amountFeedbackTypes={amountFeedbackTypes} />}
        </div >
    )
}

function Table({ bad, good, neutral, feedbacks, amountFeedbackTypes }) {
    let allFeedbacks = (feedbacks > 0 ? feedbacks : 1);
    return (
        <table >
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>percentage</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <StatisticLine text="Good" value={good} style={{ color: "green", fontWeight: "bold" }} />
                    <StatisticLine text="" value={(good / allFeedbacks * 100).toFixed(2) + " %"} />
                </tr>
                <tr>
                    <StatisticLine text="Neutral" value={neutral} />
                    <StatisticLine text="" value={(neutral / allFeedbacks * 100).toFixed(2) + " %"} />
                </tr>
                <tr>
                    <StatisticLine text="Bad" value={bad} style={{ color: "red", fontWeight: "bold" }} />
                    <StatisticLine text="" value={(bad / allFeedbacks * 100).toFixed(2) + " %"} />
                </tr>
                <tr>
                    <StatisticLine
                        text="All"
                        value={allFeedbacks}
                        style={{ backgroundColor: "black", color: "white" }}
                    />
                </tr>
                <tr>
                    <StatisticLine
                        text="Average"
                        value={(allFeedbacks / (amountFeedbackTypes == 0 ? 1 : amountFeedbackTypes)).toFixed(2)}
                        style={{ backgroundColor: "black", color: "white" }}
                    />
                </tr>
            </tbody>
        </table>
    )
}

function StatisticLine({ text, value, style }) {
    return (
        <>
            {text && <td style={style}>{text}</td>}
            <td>{value}</td>
        </>
    )
}

function Header({ title, style }) {
    return (
        <h1 style={style}> {title} </h1>
    )
}

function Button({ title, onClick, style }) {
    return (
        <button
            onClick={onClick}
            style={style}
        >
            {title}
        </button>
    )
}