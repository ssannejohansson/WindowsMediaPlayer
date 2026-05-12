import { WindowFrame } from "./components/wmp/WindowFrame";
import { Login } from "./pages/Login";
import "./App.css"

function App() {
    return (
        <WindowFrame title="Windows Media Player">
            <Login />
        </WindowFrame>
    )
}

export default App
