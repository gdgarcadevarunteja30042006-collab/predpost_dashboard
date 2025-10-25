import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import Visualize from './pages/Visualize';
import History from './pages/History';
import Alerts from './pages/Alerts';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/visualize" element={<Visualize />} />
            <Route path="/history" element={<History />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
