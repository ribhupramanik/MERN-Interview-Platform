import './App.css'
import {SignInButton, SignOutButton, SignedIn, SignedOut, UserButton} from "@clerk/clerk-react"

function App() {
  return (
    <>
      <h1>Wlcome to app</h1>
      <SignedOut>
        <SignInButton mode='modal'>
          <button>Login</button>
        </SignInButton>
      </SignedOut>
      
      <SignedIn>
        <SignOutButton/>
      </SignedIn>
      
      <UserButton/>
    </>
  )
}

export default App
