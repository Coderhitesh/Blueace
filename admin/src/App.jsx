import './App.css'
import { BrowserRouter } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <BrowserRouter>
        <Home />
        <Toaster />
      </BrowserRouter>
    </>
  )
}

export default App
