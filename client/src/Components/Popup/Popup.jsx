import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Popup() {
    const [category,setCategory] = useState({})
    const [service,setService] = useState({})

    const handleFetchCategory = async() => {
        try {
            const {data} = await axios.get('http://localhost:7987/api/v1/get-all-service-category')
            setCategory(data.data)
        } catch (error) {
            console.log("Internal server error",error)
        }
    }

    useEffect(()=>{
        handleFetchCategory()
    },[])

    const handleFetchService = async() => {
        try {
            const {data} = await axios.get('http://localhost:7987/api/v1/get-all-service')
        } catch (error) {
            console.log("Internal server error",error)
        }
    }

  return (
    <div>
      
    </div>
  )
}

export default Popup
