import { Route, Redirect } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const PrivateRoute = ({children, ...rest}) => {     // here the children is accepted from the app.js file and all the props are used using 3 dot using spread oprator  
    
    let {user} = useContext(AuthContext)           //to get the user from the useContext and received it from authcontext, by applying this the user will be able to see the page
    return(
        <Route {...rest}>{!user ? <Redirect to="/login" /> :   children}</Route>     // if user is not authenticated then it will redirect to login page 
    )
}
    
const AdminRoute = ({children, ...rest}) => {
    let {user} = useContext(AuthContext)
    return(
        <Route {...rest}>{!user ? <Redirect to="/admin/login" /> :   children}</Route>
    )
}

export {PrivateRoute,AdminRoute};