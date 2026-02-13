import {SignInButton, SignOutButton, SignedIn, SignedOut, UserButton, useAuth} from "@clerk/clerk-react"
import {Routes, Route, Navigate} from "react-router"
import {Toaster} from "react-hot-toast"
import HomePage from "./pages/HomePage"
import ProblemsPage from "./pages/ProblemsPage"

function App() {

  const {isSignedIn, isLoaded}=  useAuth()
    if (!isLoaded) {
      return <div>Loading...</div>
    }
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/problems" element={isSignedIn ? <ProblemsPage/> : <Navigate to={"/"}/>}/>
    </Routes>
    <Toaster/>
    </>
  )
}

export default App
