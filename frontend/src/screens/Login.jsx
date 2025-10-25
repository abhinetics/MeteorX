import { Link,useNavigate } from "react-router-dom";
import {useState,useContext} from 'react'
import axios from '../config/axios'
import {UserContext} from '../contex/user.context'

export default function Login() {

    const [email,setEmail] = useState('')
    const[password,setPassword] = useState('')

    const {setUser} = useContext(UserContext)

    const navigate =useNavigate()
    function submitHandler(e){
        e.preventDefault()
        axios.post('/users/login', {
            email,
            password
        }).then((res)=>{

            console.log(res.log)
            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            navigate('/')

        }).catch((err)=>{
            console.log(err.response.data)
        })
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form className="space-y-4"
        onSubmit={submitHandler}
        >
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
            onChange={(e)=>setEmail(e.target.value)}  
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
                onChange={(e)=>setPassword(e.target.value)}
              type="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}