
import Home from './pages/Home/Home'
import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import {Toaster} from 'react-hot-toast';

function App() {

  return (
    <Router>
      <Toaster />
      <Home />
    </Router>
  )
}

export default App
