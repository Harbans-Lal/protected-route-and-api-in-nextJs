"use client"
import { useRouter } from 'next/router';
import React, {  useContext, useState } from 'react'
import { json } from 'stream/consumers';
import { object, string} from 'yup';

 const register = () => {
    const router = useRouter();
    const [error , setError] = useState({
        uName:"",
        email:"",
        passwd:"",
    });
    const [loginError, setLoginError] = useState({
        email:"",
        passwd:""
    })

    //define schma ........................
    const userSchema = object({
        uName:string().required("the user name is required").matches(/^[A-Za-z0-9]+$/, "use letters and numbers"),
        email:string().email('invalid email').required('email is required'),
        passwd:string().required("password is required").min(6,"password must be 6 character"),
        
    });
    const loginUserSchema = object({
        email:string().email('invalid email').required('email field is required'),
        passwd:string().min(6,"min need 6 digit >>>>>>>>>")
    })

    const [user, setUser] = useState({
        uName:"",
        email:"",
        passwd:""
    })
    const [loginUser, setLoginUser] = useState({
        email:"",
        passwd:"",
       
    })
    const [toggle, setToggle] = useState(false)

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setUser((prev)=>({
            ...prev,
            [name]:value
        }))   

       setLoginUser((prev)=>({
        ...prev,
        [name]:value
       }))
    }
    const handleSubmit =async (e) =>{
        e.preventDefault();
        console.log("workign....")
        let userData = {
            username:user.uName,
            email: user.email,
            password:user.passwd
        }
     
        try{
         
            await userSchema.validate(user,  {abortEarly:false});

           await fetch('http://192.168.2.206:3001/api/users/signup',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(userData)
            }).then(res => res.json()).then(data=> console.log(data)).catch(err => console.log(err));

            setError({
                uName:"",
                email:"",
                passwd:""
            })
            setUser({
                uName:"",
                email:"",
                passwd:""
            })

        }catch (err) {
        const formError = err.inner.reduce((acc, error) =>{
            acc[error.path] = error.message
            return acc;
        },{})
       setError(formError)
        }
    }

    const handleLogin = async(e) =>{
        e.preventDefault();

        let loginData = {
            email:loginUser.email,
            password:loginUser.passwd
        }
        console.log(loginData, "boyd data // all data>>>>>>>>>>>>>>")
        try{
            await loginUserSchema.validate(loginUser, {abortEarly:false});

            await fetch('http://192.168.2.206:3001/api/users/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(loginData)
            }).then(res => res.json()).then(data => {
                console.log("ressssss",data)
                if(data.success === true && data.token != ""){
                    localStorage.setItem('token', JSON.stringify(data.token));
                    router.push('/profile')
                }
            }).catch(err => console.log(err))
           
            setLoginError({
                 email:"",
                passwd:""
            });
            setLoginUser({
                email:"",
                passwd:""
            })
        }catch(err){
            const formErrors = err.inner.reduce((acc, error) =>{
                acc[error.path] = error.message
                return acc;
            },{});
            setLoginError(formErrors)
        }
    }

  return (
    <>
       
        {toggle? <form className='border h-[500px]: w-[100%] flex justify-center items-center flex-col gap-7 mt-7 mb-7 pb-6' >
            <h1 className='text-bold text-xl p-2'>Company name</h1>

             <input name ='email' onChange={handleChange} className='p-2 border rounded-sm' type="email" value={loginUser.email} placeholder='email'/>
             {loginError.email && <div className='text-red-500'>{loginError.email}</div>}

            <input name='passwd' onChange={handleChange} className='p-2 border rounded-sm' type="password" value={loginUser.passwd} placeholder='password'/>
            {loginError.passwd && <div className='text-red-500'>{loginError.passwd}</div>}

            <button className='p-2 bg-sky-500 text-white w-32' onClick={handleLogin} >Login</button>
            <p>not register ? <a className='cursor-pointer' onClick={()=>setToggle(!toggle)}>signUp</a></p>
        </form>: 
        <form   className='border h-[500px]: w-[100%] flex justify-center items-center flex-col gap-7 mt-7 mb-7 pb-6' >
            <h1 className='text-bold text-xl p-2'>Company name</h1>
            <input  name ='uName' onChange={handleChange}  className='p-2 border rounded-sm' type="text" value={user.uName} placeholder='username'/>
            {error.uName && <div className='text-red-500'>{error.uName}</div>}

            <input  name ='email' onChange={handleChange} className='p-2 border rounded-sm' type="email" value={user.email} placeholder='email'/>
            {error.email && <div className='text-red-500'>{error.email}</div>}

            <input  name ='passwd' onChange={handleChange} className='p-2 border rounded-sm' type="password" value={user.passwd} placeholder=' password'/>
            {error.passwd && <div className='text-red-500'>{error.passwd}</div>}

            <button className='p-2 bg-sky-500 text-white w-32' onClick={handleSubmit}>signUp</button>
            <p>already register ? <a className='cursor-pointer' onClick={()=>setToggle(!toggle)}>signIn</a></p>
        </form>}
    </>
  )
}

export default register;