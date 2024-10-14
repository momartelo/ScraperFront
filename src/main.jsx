import { BrowserRouter } from "react-router-dom";
import AppRouter from './AppRouter.jsx'
import ReactDOM from "react-dom/client";
import './main.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
)
