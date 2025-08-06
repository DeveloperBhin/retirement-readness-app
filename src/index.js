import ReactDOM from 'react-dom/client';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App.js';
import { HashRouter, Route, Routes, NotFound } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter basename="/">
    <Routes>
      <Route exact path="/" element={<App/>}/>
      <Route exact path="/:_navItem" element={<App/>}/>
      <Route exact path="/:_navItem/:_navSubItem" element={<App/>}/>
      <Route exact path="/:_navItem/:_navSubItem/:_navExtraItem" element={<App/>}/>
      <Route exact path="/:_navItem/:_navSubItem/:_navExtraItem/:_navMoreItem" element={<App/>}/>
    </Routes>
  </HashRouter>
);


