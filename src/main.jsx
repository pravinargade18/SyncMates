import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserProvider } from './context/authContext.jsx'
import { ChatContextProvider } from './context/chatContext.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <ChatContextProvider>
          <App />
    </ChatContextProvider>
  </UserProvider>
);
