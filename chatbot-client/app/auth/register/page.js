import Image from "next/image"
import Link from "next/link"

function Register() {
  return (
    <div className="mx-auto flex h-screen max-w-lg flex-col md:max-w-none md:flex-row md:pr-4">
    <div className="max-w-3xl rounded-3xl bg-gradient-to-t from-secondColor via-thirdColor to-primeColor px-4 py-10 text-white sm:px-10 md:m-6 md:mr-8">
      <p className="mb-20 font-bold tracking-wider">Star Comapny</p>
      <p className="mb-4 text-3xl font-bold md:text-4xl md:leading-snug">
        Start your <br />
        journey with us
      </p>
      <p className="mb-28 leading-relaxed text-gray-200">Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere nisi voluptas a officia. Omnis.</p>
      <div className="bg-primeColor rounded-2xl px-4 py-8">
        <p className="mb-3 text-gray-200">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error ea voluptates sapiente!</p>
        <div className="">
          <div className="flex items-center">
            <Image className="h-10 w-10 rounded-full object-cover" width={100} height={100} quality={100} src="/images/ayman-wa3r.jpg" alt="owner"/>
            <p className="ml-4 w-56">
              <strong className="block font-medium">Ayman Gassi</strong>
              <span className="text-xs text-gray-200"> Owner of Start-Campany </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="px-4 py-20 w-5/12">
      <h2 className="mb-2 text-3xl font-bold">Sign Up</h2>
      <Link href="/auth/login" className="mb-10 block font-bold text-primeColor">Have an account</Link>
      <p className="mb-1 font-medium text-gray-500">Full Name</p>
<div className="mb-4 flex space-x-4">
  <div className="flex-1 focus-within:border-primeColor relative flex overflow-hidden rounded-md border-2 transition">
    <input 
      type="text" 
      id="signup-password" 
      className="w-full border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" 
      placeholder="Enter your FirstName" 
    />
  </div>
  <div className="flex-1 focus-within:border-primeColor relative flex overflow-hidden rounded-md border-2 transition">
    <input 
      type="text" 
      id="signup-password" 
      className="w-full border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" 
      placeholder="Confirm your LastName" 
    />
  </div>
</div>

      <p className="mb-1 font-medium text-gray-500">Email</p>
      <div className="mb-4 flex flex-col">
        <div className="focus-within:border-primeColor relativeflex overflow-hidden rounded-md border-2 transition w-full">
          <input type="email" id="signup-email" className="w-full border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your email" />
        </div>
      </div>
      
      <p className="mb-1 font-medium text-gray-500">Job</p>
      <div className="mb-4 flex flex-col">
        <div className="focus-within:border-primeColor relativeflex overflow-hidden rounded-md border-2 transition w-full">
          <input type="text" id="signup-email" className="w-full border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your Position" />
        </div>
      </div>
      <p className="mb-1 font-medium text-gray-500">Password</p>
      <div className="mb-4 flex flex-col">
        <div className="focus-within:border-primeColor relative flex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
          <input type="password" id="signup-password" className="w-full border-gray-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your password" />
        </div>
      </div>
      <button className="hover:shadow-thirdColor rounded-xl bg-gradient-to-r from-thirdColor to-secondColor px-8 py-3 font-bold text-white transition-all hover:opacity-90 hover:shadow-lg">Sign Up</button>
    </div>
    </div>
  
  )
}

export default Register
