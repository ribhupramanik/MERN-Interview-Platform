import {SignInButton, SignOutButton, SignedIn, SignedOut, UserButton} from "@clerk/clerk-react"
import {Routes, Route} from "react-router"

function App() {
  return (
    <Routes>
      <h1>Welcome to app</h1>

     
      <SignedOut>
        <SignInButton mode='modal'>
          <button>Login</button>
        </SignInButton>
      </SignedOut>
      
      <SignedIn>
        <SignOutButton/>
      </SignedIn>
      
      <UserButton/>
    </Routes>
  )
}

export default App
