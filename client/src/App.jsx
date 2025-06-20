import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Track from "./components/Track/Track.jsx";
import AddShipment from "./components/AddShipment/AddShipment.jsx";
import Trace from "./components/Trace/Trace.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home/*" element={<HomePage />}>
          <Route path="track" element={<Track />} />
          <Route path="trace" element={<Trace />} />
          <Route path="addshipment" element={<AddShipment />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
