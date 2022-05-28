import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import {PrivateRoute,AdminRoute} from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/user/HomePage'
import LoginPage from './pages/user/LoginPage'
import SignUp from './pages/user/SignUp';
import AdminLogin from './pages/admin/AdminLogin';
import AdminHome from './pages/admin/AdminHome';
import AdminCreate from './pages/admin/AdminCreate'
import AdminEdit from './pages/admin/AdminEdit'

function App() {
  return (
    <div className="App container-fluid">
     
      <Router>
        <AuthProvider>
          <PrivateRoute component={HomePage} path="/" exact/>     {/* we need to pass this component and path and exact these things are properties of the privateroute and we need to pass it to the private route as props as children */}
          <Route component={LoginPage} path="/login"/>            {/* this is used to allow a user to go into the link if he is authenticated */}       
          <Route component={SignUp} path="/signup"/>
          <Route component={AdminLogin} path="/admin/login"/>
          <AdminRoute component={AdminHome} path="/admin/home"/>
          <Route component={AdminCreate} path="/admin/create"/>
          <Route component={AdminEdit} path="/admin/edit"/>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
