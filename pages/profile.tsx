"use client"
import axios from 'axios';
import { useRouter } from 'next/router'
import React, { use, useEffect, useState } from 'react'

const  profile =  () => {
  const router = useRouter();;
  const [user, setUser]= useState({})
  useEffect(()=>{
    let token =JSON.parse(localStorage.getItem('token'));
    
    if(!token){
      router.push('/')
    }
    fetch('http://192.168.2.206:3001/api/users/me',{
      headers :{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res =>  res.json())
    .then(data => setUser(data.data))
    .catch(err => console.log(err))

  },[])

  const handleLogout = () =>{
    localStorage.removeItem('token');
    router.push('/');
  }
console.log(user)
  return (
    <div>
    
      Welcome  <h1>{user.username}</h1>.............
      <button className='bg-sky-500 text-white p-2' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default profile;