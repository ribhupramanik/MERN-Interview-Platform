import {SignInButton, SignOutButton, SignedIn, SignedOut, UserButton, useAuth} from "@clerk/clerk-react"
import {Routes, Route, Navigate} from "react-router"
import {Toaster} from "react-hot-toast"
import HomePage from "./pages/HomePage"
import ProblemsPage from "./pages/ProblemsPage"

function App() {

  const {isSignedIn, isLoaded}=  useAuth()
    if (!isLoaded) {
      return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-xl text-primary"></span>
      </div>
    )
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
