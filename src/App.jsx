import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import our components and pages
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Transactions from './pages/Transactions/Transactions';
import AddTransaction from './pages/AddTransaction/AddTransaction';
import Budget from './pages/Budget/Budget';
import Analytics from './pages/Analytics/Analytics';

function App() {
  return (
    // FinanceProvider gives all pages access to transactions and budget data
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          {/* Layout wraps all pages with the sidebar */}
          <Route element={<Layout />}>
            {/* Redirect home page to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Our 5 main pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/new" element={<AddTransaction />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Toast notifications pop up at bottom-right */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </FinanceProvider>
  );
}

export default App;