import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserProvider } from './context/authContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider>
      <App />
  </UserProvider>
)
