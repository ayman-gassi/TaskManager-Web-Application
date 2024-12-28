"use client";
import { useForm } from 'react-hook-form';
import { FiMail, FiUser  } from 'react-icons/fi';
import { FaLongArrowAltLeft } from "react-icons/fa";
import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';
import ErrorAlert from '@/app/_components/Notifications/ErrorAlert';
import SucessAlert from '@/app/_components/Notifications/SucessAlert';
function RecoverPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
   const[message, setMessage] = useState('');
   const [showSuccess, setShowSuccess] = useState(false);
   const [showError, setShowError] = useState(false);
  const onSubmit =  async (data) => {
    setMessage("");
    setShowError(false);
    setShowSuccess(false);
     const response = await axios.post(process.env.NEXT_PUBLIC_API_URL+"users/forgotPassword", data);
     if(response.data.state === false){
        setMessage(response.data.message);
       setShowError(true);
     }
     else{
        setMessage(response.data.message);
       setShowSuccess(true);
     }    
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
        <div className='w-full max-w-4xl p-8 bg-white shadow-md rounded-lg'>
          <Link href='/auth/login' className='text-center flex text-base items-center text-primeColor hover:text-secondColor'>
            <FaLongArrowAltLeft className='size-5 mr-1' /> Return to Login
          </Link>
          <div className='mb-10 text-center flex flex-col items-center justify-center'>
            <h1 className='text-4xl font-bold text-gray-800 mb-4'>Forgot Your Password?</h1>
            <p className='text-gray-600'>Enter your details below to recover your account</p>
            <img src='https://objectstorage.me-dubai-1.oraclecloud.com/n/axwzijd5v1vn/b/DSL_IMAGES/o/IMAGE/340231ff-3960-41e3-b33e-da7e69725ba9-recoverp.png' alt='Recover Password' className='h-[250px] w-[250px]' />
          </div>
          {showError && <ErrorAlert errorMessage={message} />}
          {showSuccess && <SucessAlert sucessMessage={message} />}
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex flex-col'>
                <label htmlFor='email' className='text-sm font-medium text-gray-700'>Email Address</label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FiMail className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type='email'
                    id='email'
                    className={`focus:ring-primeColor focus:border-primeColor block p-2 w-full pl-10 sm:text-sm border-gray-300 rounded-md ${errors.email ? 'border-red-500' : ''}`}
                    placeholder='Enter your email address'
                    {...register('email', { required: 'Email is required' })}
                  />
                </div>
                {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
              </div>
              <div className='flex flex-col'>
                <label htmlFor='username' className='text-sm font-medium text-gray-700'>Username</label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <FiUser  className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    id='userName'
                    className={`focus:ring-primeColor focus:border-primeColor block w-full p-2 pl-10 sm:text-sm border-gray-300 rounded-md ${errors.username ? 'border-red-500' : ''}`}
                    placeholder='Enter your username'
                    {...register('userName', { required: 'Username is required' })}
                  />
                </div>
                {errors.userName && <span className='text-red-500 text-sm'>{errors.userName.message}</span>}
              </div>
            </div>

            <button type='submit' className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primeColor hover:bg-thirdColor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-thirdColor'>
              Send Recovery Link
            </button>
 </form>
        </div>
      </div>
    </>
  );
}

export default RecoverPassword;