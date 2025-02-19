import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./login"
import Dashboard from "./Dashboard"

const App = () =>{
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path= 'dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App