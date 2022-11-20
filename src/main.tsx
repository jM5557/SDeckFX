import ReactDOM from 'react-dom/client'
import App from './App';
import { registerSW } from "virtual:pwa-register";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <App />
);

if ("serviceWorker" in navigator) {
    // && !/localhost/.test(window.location)) {
    registerSW();
}