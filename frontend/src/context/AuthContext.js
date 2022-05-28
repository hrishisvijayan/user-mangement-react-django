  import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom'         //useHistory is used to redirect to other page
import axios from 'axios'
import swal from 'sweetalert'

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({children}) => { 
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)    //before any user is authenticated we make the auth token as null, and in the beginning there will be data in an encoded form and we can view it in jw.io site , localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) this is used because if the user refreshes the page then the token has to be parsed(which means in the local storage it is stored as stringify and parse is used to convert it back to the previous form ) and should be logged in , the arrow function inside the usestate is for making it efficent that it will only work for the first time not always check every time it loads
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)                //befor any user is authenticated we make the user as null ,       here from the token the user data is being converted to the real form that we can understand to decode we use the npm decode pachage installer , the local storage is written after writing the code in line 36, localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null this is used so that inorder to keep the user logged in we need to jwt decode to get the data in the proper form by the user ,  the arrow function inside the usestate is for making it efficent that it will only work for the first time not always check every time it loads
    let [loading, setLoading] = useState(true)
    let [users, setUsers] = useState([])
    const [userEdit,setUserEdit] = useState([])
    const [errorMsg,setErrorMsg] = useState('')

    const history = useHistory()                   

    let loginUser = async (e )=> {                 //here async is used because the process may be time consuming and it will wait till it gets data    
        
        let response = await fetch('http://127.0.0.1:8000/api/token/', {    // do some reasearch on await because it is coming as a part of async
            method:'POST',
            headers:{                                //headers is also an object
                'Content-Type':'application/json'    //we are telling the back end hey this is json data
            },
            body:JSON.stringify({'username':e.username, 'password':e.password})     //this is the data that we are sending to the backend ,strigify is used to convert the data into a string, here the username and password are from the login page input field name         
        })
        let data = await response.json()             //here in the data is variable the response is saved 
        console.log('here is the experiment',data.data);
        if(response.status === 200){
            setAuthTokens(data)                      //access and refresh token
            setUser(jwt_decode(data.access))         //access token is here and decoded in to readable form using the decoder package installer
            localStorage.setItem('authTokens', JSON.stringify(data))        //here the local storage is saving the token in order to keep the user logged in after few days
            history.push('/')                        //once the user is logged in it will direct to home page
        }else{
            alert('Something went wrong!')
        }
    }

    const loginAdmin = async (e)=>{
        const response = await axios.post('http://127.0.0.1:8000/api/token/',{
            'username' : e.username,
            'password' : e.password
        })
        if (response.status === 200) {
            setAuthTokens(response.data);
            setUser(jwt_decode(response.data.access));
            localStorage.setItem('authTokens', JSON.stringify(response.data));
            // setErrorLogin(null)
            history.push('/admin/home');
        }else{
            alert('wrong')
            // setErrorLogin('Username or Password is error')
        }
    }

    const getUsers = async () => {
        console.log('haii');
        const data = await axios.post('http://localhost:8000/api/get-user/',{},{
            headers: {
              Authorization: `Bearer ${authTokens.access}`
            }
          })
          
          setUsers(data.data);
        }

    const createUser = async (e)=>{
        // console.log(e.target);
        
        if (e.target == undefined) {
            var name = e.name
            var username = e.username
            var email = e.email
            var password = e.password
        }else{
            e.preventDefault();
            var name = e.target.name.value
            var username = e.target.username.value
            var email = e.target.email.value
            var password = e.target.password.value
        }
        // http://localhost:8000/api/signup
        const response = await axios.post('http://localhost:8000/api/signup/',{     
            'first_name' : name,
            'username' : username,
            'password' : password,
            'email': email
        },{
            headers: {
                Authorization: `Bearer ${authTokens.access}`
            }
        })
        if (response.status === 200) {
            getUsers();
            history.push('/admin/home')
        }
    }
    // const createUser = async (e)=>{
    //     // e.preventDefault();
    //     // http://localhost:8000/api/signup
    //     const response = await axios.post('http://localhost:8000/api/signup/',{     
    //         'first_name' : e.target.name.value,
    //         'username' : e.target.username.value,
    //         'password' : e.target.password.value
    //     },{
    //         headers: {
    //             Authorization: `Bearer ${authTokens.access}`
    //         }
    //     })
    //     if (response.status === 200) {
    //         getUsers();
    //         history.push('/admin/home')
    //     }
    // }


   




    const updateUser = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:8000/api/updateuser/',{
            'id' : userEdit.id,
            'name' : e.target.name.value,
            'username' : e.target.username.value,
        },{
            headers: {
                Authorization: `Bearer ${authTokens.access}`
            }
        })
        if (response.data.status === 'true') {
            setUserEdit(null);
            history.push('/admin/home');
        }
    }

    const userDetails = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:8000/api/userdetails/',{
            'id' : e.target.value,
        },{
            headers: {
              Authorization: `Bearer ${authTokens.access}`
            }
          })
          const singleUser = response.data.data
        setUserEdit(singleUser);
        console.log(singleUser);
        history.push('/admin/edit');
    }

    const deleteUser = async (e) => {
        e.preventDefault();

        swal({
            title: "Are you sure?",
            text: "Are you sure  you want to delete this user?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then( async (willDelete) => {
            if (willDelete) {
              
              swal("User Deleted", {
                icon: "success",
              });
              const response = await axios.post('http://localhost:8000/api/deleteuser/',{
                'id' : e.target.value,
            },{
                headers: {
                    Authorization: `Bearer ${authTokens.access}`
                  }
            })
            setUsers(response.data);
   
            } 
          })

              
        
    }

    let logoutUser = (e) => {
        e.preventDefault()
        swal({
            title: "Are you sure?",
            text: "Are you sure that you want to leave this page?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              
              swal("You successfully Logout", {
                icon: "success",
              });
                setAuthTokens(null)             //when the user is logged out then the bothe token and user is set is made null
                setUser(null)
                localStorage.removeItem('authTokens')  //after logout teh authtoken inside the localstorage will be removed
                history.push('/login')
            } 
          })
    }


    let logoutAdmin = () => {

        swal({
            title: "Are you sure?",
            text: "Are you sure that you want to leave this page?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              
              swal("You successfully Logout", {
                icon: "success",
              });
                setAuthTokens(null)
                setUser(null)
                localStorage.removeItem('authTokens')
                history.push('/admin/login')
            } 
          })

        
    }


    let contextData = {
        user:user,
        users:users,
        authTokens:authTokens,
        setAuthTokens:setAuthTokens,
        setUser:setUser,
        loginUser:loginUser,             // here the login user is coming from the login user is above line 22
        loginAdmin:loginAdmin,
        logoutUser:logoutUser,
        logoutAdmin:logoutAdmin,
        getUsers:getUsers,
        createUser:createUser,
        updateUser:updateUser,
        userDetails:userDetails,
        deleteUser:deleteUser,
        userEdit:userEdit,
        errorMsg:errorMsg,
        setErrorMsg:setErrorMsg
    }


    useEffect(()=> {

        if(authTokens){
            setUser(jwt_decode(authTokens.access))
        }
        setLoading(false)


    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
