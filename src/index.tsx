import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalContext from './components/GlobalContext/GlobalContext';
import './index.css';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <GlobalContext>
    <App />
  </GlobalContext>
);
