import React, {useEffect, useMemo} from "react"
import { milisecondsToDisplayFormat } from "../App"
import record from "../images/record.svg"

export default function Timer({
    tenzies,
    startupDelayed,
    startTime,
    gameHistory,
    elapsedTime,
    setElapsedTime}) {

    const recordTime = useMemo(() => (
        gameHistory.length === 0 ? Number.MAX_VALUE :
        gameHistory.sort((a, b) => a.time > b.time ? 1 : -1)[0].time
    ), [gameHistory]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!tenzies && !startupDelayed) {
                const now = new Date().getTime();
                setElapsedTime(now - startTime)
            }
        }, 50);
        return () => clearInterval(interval);
    })

    return (
        <section className="roll-timer">
            {elapsedTime <= recordTime && tenzies && <img src={record} className="record" alt="Record" /> }
            {milisecondsToDisplayFormat(elapsedTime)}
        </section>
    )
}