import React, {useState, useEffect, useMemo} from "react"
import {nanoid} from "nanoid"
import ReactConfetti from "react-confetti"
import Timer from "./components/Timer"
import Die from "./components/Die"
import three from "./images/three.svg"
import two from "./images/two.svg"
import one from "./images/one.svg"
import start from "./images/start.svg"

export function milisecondsToDisplayFormat(miliseconds) {
    const elapsedSec = String(Math.floor(miliseconds / 1000)).padStart(2, "0")
    const elapsedMilisec = String(miliseconds % 1000).padStart(3, "0")
    return `${elapsedSec}.${elapsedMilisec}`
}

export default function App() {
    const loadGameHistory = () => (JSON.parse(localStorage.getItem("gameHistory")));
    const newDie = () => ({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
    });
    const allNewDice = () => Array(10).fill().map(newDie);
    const [dice, setDice] = useState(allNewDice());
    const [dotDiceFaces, setDotDiceFaces] = useState(true); // TODO: Button to toggle this
    const [tenzies, setTenzies] = useState(false);
    const [rollCount, setRollCount] = useState(1);
    const [gameTime, setGameTime] = useState(0);
    const [startupDelayed, setStartupDelayed] = useState(true);
    const [gameHistory, setGameHistory] = useState(() => loadGameHistory() || []);
    const [startTime, setStartTime] = useState(new Date().getTime());
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        (async () => {
            await new Promise(resolve => setTimeout(resolve, 4000));
            console.log("start")
            setStartupDelayed(false)
        })();
    }, [])
    
    useEffect(() => {
        if (tenzies || !startupDelayed) {
            setStartTime(new Date().getTime());
        }
    }, [tenzies, startupDelayed, setStartTime])

    const toggleFaces = () => setDotDiceFaces(prevDotDiceFaces => !prevDotDiceFaces)

    const holdDice = id => {
        setDice(prevDice => prevDice.map(die => {
            return die.id === id ? {...die, isHeld: !die.isHeld} : die
        }))
    };

    const rollDice = () => {
        if (tenzies) {
            setDice(allNewDice());
            setRollCount(1);
            setTenzies(false)
        } else {
            setDice(prevDice => prevDice.map(die => {
            return die.isHeld ? die : newDie()
            }))
            setRollCount(prevcount => prevcount + 1)
        }
    };

    useEffect(() => {
        const didWin = dice.reduce((prev, curr) => {
            return (!prev.value || prev.value !== curr.value || !curr.isHeld || !prev.isHeld) ?
            false : curr
        });
        if (didWin) {
            setTenzies(true);
            setGameTime(elapsedTime)
        }
    }, [dice, rollCount, gameTime, elapsedTime])

    const gameHistoryItem = useMemo(() => {
        const today = new Date();
        return {
            time: gameTime,
            rolls: rollCount,
            date: today.toJSON()
        }
    }, [gameTime, rollCount]);
    
    useEffect(() => {
        if (tenzies) {
            setGameHistory(oldGameHistory => (
                [gameHistoryItem, ...oldGameHistory]
            ))
            console.log(gameHistoryItem)
        }
    }, [tenzies, gameHistoryItem])

    useEffect(() => {
        localStorage.setItem("gameHistory", JSON.stringify(gameHistory))
    }, [gameHistory])

    const dieElements = dice.map(props => (
        <Die key={props.id}
             holdDice={() => holdDice(props.id)} 
             dotDiceFaces={dotDiceFaces}
             disabled={tenzies}
             {...props}/>
    ));
    
    const gameHistoryElements = gameHistory
        .sort((a, b) => a.time > b.time ? 1 : -1)
        .filter((_, i) => i < 5)
        .map((history, key) => {
            const date = new Date(history.date);
            return (
                <tbody key={key}>
                    <tr>
                        <td>{date.toDateString()}</td>
                        <td>{milisecondsToDisplayFormat(history.time)}s</td>
                        <td>{history.rolls}</td>
                    </tr>
                </tbody>
    )})

    return (
        <main>
            <div className="game-container">
            <h1>Tenzies</h1>
            <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                <div className="countdown">
                    <img className="three" src={three} alt="3"></img>
                    <img className="two" src={two} alt="2"></img>
                    <img className="one" src={one} alt="1"></img>
                    <img className="start" src={start} alt="START"></img>
                </div>
                {dieElements}
            </div>
            <div className="roll-stuff">
                <Timer
                    tenzies={tenzies}
                    setGameTime={setGameTime}
                    startupDelayed={startupDelayed}
                    startTime={startTime}
                    gameHistory={gameHistory}
                    elapsedTime={elapsedTime}
                    setElapsedTime={setElapsedTime}
                />
                <button type="button" className="roll-button" onClick={rollDice}>
                    {tenzies ? "New Game" : "Roll"}
                </button>
                <section className="roll-count">
                    {`${rollCount} ${rollCount === 1 ? "roll" : "rolls"}`}
                </section>
            </div>
            </div>
            {gameHistoryElements.length > 0 &&
            <div className="game-history-container">
                <h2>Rankings</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Rolls</th>
                        </tr>
                    </tbody>
                    {gameHistoryElements}
                </table>
            </div>}
            {tenzies && <ReactConfetti/>}
        </main>
    )
}