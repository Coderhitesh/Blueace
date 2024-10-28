import Home from './pages/Home/Home'
import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Login from './pages/Auth/Login';

function App() {
  const role = sessionStorage.getItem('role')

  // console.log('role', role)
  if (!role) {

    return <Router>
      <Toaster />
      <Login />
    </Router>

  }
  return (
    <Router>
      <Toaster />
      <Home />
    </Router>
  )
}

export default App
