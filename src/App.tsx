import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Main from "./components/Main"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route element={<Main />}>
        <Route path="/home" element={<Home/>} />
      </Route>
    </Routes>
  )
}

export default App