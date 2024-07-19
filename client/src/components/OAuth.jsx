import React from 'react';
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const handleGoogleClick=async()=>{
    try {
      const provider=new GoogleAuthProvider()

      //app is given as parameter so firebase knows which project is requesting authentication
      const auth=getAuth(app)
      const result=await signInWithPopup(auth,provider)

      //sends a POST request to the /api/auth/google endpoint with the user's Google profile information (name, email, and photo) in JSON format
      //one to authenticate the user on backend server using the details provided by Google's authentication service.
      const res=await fetch('/api/auth/google',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',

        },
        body:JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL}),
      });
      const data=await res.json();
      dispatch(signInSuccess(data));
      navigate("/");

      } catch (error) {
      console.log('could not sign in with google',error);
    }
  };
  return (
    //when type is button doesn't submit the form
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with google</button>
  )
}
