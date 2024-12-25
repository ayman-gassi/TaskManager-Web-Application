import Image from "next/image"
import Link from "next/link"

function Login() {
  return (
    <div className="flex w-screen flex-wrap text-slate-800">
    <div className="flex w-full flex-col md:w-1/2">
      <div className="flex justify-center pt-12 md:justify-start md:pl-12">
        <Link href="/" className="text-2xl font-bold text-primeColor"> Star Campany </Link>
      </div>
      <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
        <p className="text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl">
          Welcome back <br />
          to <span className="text-primeColor">Star Campany </span>
        </p>
        <p className="mt-6 text-center font-medium md:text-left">Sign in to your account below.</p>
  
        <form className="flex flex-col items-stretch pt-3 md:pt-8">
          <div className="flex flex-col pt-4">
            <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-primeColor">
              <input type="email" id="login-email" className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Email" />
            </div>
          </div>
          <div className="mb-4 flex flex-col pt-4">
            <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-primeColor">
              <input type="password" id="login-password" className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Password" />
            </div>
          </div>
          <a href="#" className="mb-6 text-center text-sm font-medium text-gray-600 md:text-left">Forgot password?</a>
          <button type="submit" className="rounded-lg bg-primeColor px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-thirdColor ring-offset-2 transition hover:bg-thirdColor focus:ring-2 md:w-32">Sign in</button>
        </form>
        <div className="py-12 text-center">
          <p className="text-gray-600">
            Don't have an account?
            <Link href="/auth/register" className=" ml-1 whitespace-nowrap font-semibold text-thirdColor ">Sign up for free.</Link>
          </p>
        </div>
      </div>
    </div>
    <div className="relative hidden h-screen select-none bg-thirdColor bg-gradient-to-br md:block md:w-1/2">
      <div className="py-16 px-8 text-white xl:w-[40rem]">
        <span className="rounded-full bg-white px-3 py-1 font-medium text-primeColor">New Feature</span>
        <p className="my-6 text-3xl font-semibold leading-10">Manage Your task now  with <span className="abg-white whitespace-nowrap py-2 text-cyan-300">Chat-Star</span>.</p>
        <p className="mb-4">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Incidunt necessitatibus nostrum repellendus ab totam.</p>
        <a href="#" className="font-semibold tracking-wide text-white underline underline-offset-4">Learn More</a>
      </div>
      <img className="ml-8 w-11/12 max-w-lg rounded-lg object-cover" src="https://cdn.devdojo.com/images/march2021/green-dashboard.jpg" />
    </div>
  </div>
  
  )
}

export default Login
