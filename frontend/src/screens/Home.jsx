import { useState,useEffect } from 'react'
import React,{useContext} from 'react'
import {UserContext} from '../contex/user.context'
import axios from '../config/axios'
import { useNavigate } from 'react-router-dom'


const Home = () => {

  const {user} = useContext(UserContext)
  const [isModalOpen, setisModalOpen]= useState(false)
  const [projectname,setProjectName] =useState(null)
  const [project, setProject] =useState([])

  const navigate = useNavigate()
  function createProject(e){
    e.preventDefault()
    console.log({projectname})
    axios.post('/projects/create',{
      name:projectname,
    }).then((res)=>{
      console.log(res)
      setisModalOpen(false)
    }).catch((error)=>{
      console.log(error)
    })
  }

      useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)
            // console.log(res.data)

        }).catch(err => {
            console.log(err)
        })

    }, [])

  return (
    // <div>{JSON.stringify(user)}</div>
    <main className='p-4'>

      <div className="projects flex flex-wrap gap-3">
          <div className="project">
            <button
            onClick={(e)=>{
              e.preventDefault()
              setisModalOpen(true)
            }}
            className='p-4 border border-slate-300 rounded-md' >
              New Project
            <i className="ri-add-circle-line ml-2"></i>
            </button>


             {/* map */}
               {
                    project.map((project) => (
                        <div key={project._id}
                            onClick={() => {
                                navigate(`/project`, {
                                    state: { project }
                                })
                            }}
                            className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200">
                            <h2
                                className='font-semibold'
                            >{project.name}</h2>

                            <div className="flex gap-2">
                                <p> <small> <i className="ri-user-line"></i> Collaborators</small> :</p>
                                {project.users.length}
                            </div>

                        </div>
                    ))
                }
          </div>

          {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-30 backdrop-blur-sm z-40">
    <div className="bg-white p-6 rounded-md shadow-md w-1/3 z-50">
      <h2 className="text-lg font-bold mb-4">Create New Project</h2>
      <form
        onSubmit={createProject}
      >
        <div className="mb-4">
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <input
            onChange={(e)=>setProjectName(e.target.value)}
            value={projectname}
            type="text"
            id="projectName"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            onClick={() => setisModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      </div>

     
    

      </main>

  )
}

export default Home