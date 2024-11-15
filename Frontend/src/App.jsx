import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [healthCheck, sethealthCheck] = useState(0)
  useEffect(() => {
    axios.get('/api/v1/healthcheck')
    .then((response)=>{
      sethealthCheck(response.data)
      console.log(response)
      console.log(response.data);
      
    })
    .catch((error)=>{
      console.log(error)
    })
  })
  

  return (
    <>
    <div>
    <h2>HealthCheck Report</h2>
    <ul>
      <li>{healthCheck.statusCode}</li>
      <li>{healthCheck?.data}</li>
      <li>{healthCheck.message}</li>
      <li>{healthCheck.success}</li>
    </ul>
    </div>
     </>
  )
}

export default App
