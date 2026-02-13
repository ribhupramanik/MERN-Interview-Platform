import {SignInButton, SignOutButton, SignedIn, SignedOut, UserButton, useUser} from "@clerk/clerk-react"
import {Routes, Route, Navigate} from "react-router"
import HomePage from "./pages/HomePage"
import ProblemsPage from "./pages/ProblemsPage"

function App() {

  const {isSignedIn}=  useUser()
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/problems" element={isSignedIn ? <ProblemsPage/> : <Navigate to={"/"}/>}/>
    </Routes>
  )
}

export default App
