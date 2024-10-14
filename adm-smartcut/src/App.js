import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar/AdminNavbar';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import AdmServicos from './pages/AdmServicos/AdmServicos'; 
import AdmAgendamentos from './pages/AdmAgendamentos/AdmAgendamentos';
import AdmProfissionais from './pages/AdmProfissionais/AdmProfissionais'; 

// Função para proteger rotas
const PrivateRoute = ({ element }) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    
    return isAuthenticated ? element : <Navigate to="/adm-smartcut/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Rotas do Administrador */}
                <Route path="/adm-smartcut/login" element={<Login />} />
                <Route path="/adm-smartcut/dashboard" element={<PrivateRoute element={<><AdminNavbar /><Dashboard /></>} />} />
                <Route path="/adm-smartcut/servicos" element={<PrivateRoute element={<><AdminNavbar /><AdmServicos /></>} />} />
                <Route path="/adm-smartcut/agendamentos" element={<PrivateRoute element={<><AdminNavbar /><AdmAgendamentos /></>} />} />
                <Route path="/adm-smartcut/profissionais" element={<PrivateRoute element={<><AdminNavbar /><AdmProfissionais /></>} />} />
                
                {/* Redireciona para login se a rota não for encontrada */}
                <Route path="*" element={<Navigate to="/adm-smartcut/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
