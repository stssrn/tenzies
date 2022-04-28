import React from "react"

export default function Die(props) {
    const style = {
        backgroundColor: props.isHeld ? "#59E391" : "#FFF"
    }

    const dotElements = Array(props.value).fill().map((_, i) => (
        <span key={i} className="dot"></span>
    ));

    return (
        <button 
            type="button"
            style={style}
            onClick={props.holdDice}
            disabled={props.disabled}
            data-die-number={props.value}
            className={`die ${props.dotDiceFaces ? "dot-mode" : ""}`}
        >
            {props.dotDiceFaces ? dotElements : props.value}
        </button>
    )

}