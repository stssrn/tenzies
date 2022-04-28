import React from "react"
import * as ReactDOMClient from 'react-dom/client'
import App from "./App"
import "./styles/style.css"

const root = ReactDOMClient.createRoot(document.getElementById("root"));

root.render(<App />);