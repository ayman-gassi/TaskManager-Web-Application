import { FaRobot, FaArrowRight , FaTachometerAlt ,FaCog , FaLock , FaHeadset } from "react-icons/fa";
import Link from "next/link";
function AboutSection() {
  return (
    <>
    {/* Section 1 */}
    <div className="bg-gradient-to-br from-primeColor via-thirdColor to-secondColor min-h-screen mt-2 " id="AboutSection" >
        <div className="container mx-auto px-14 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-white" >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Manage Your Tasks Effortlessly with Chatbot Assistant!
              </h1>
              <p className="text-lg lg:text-xl mb-8 text-gray-100">
                Get instant help, set reminders, and manage your tasks seamlessly with our AI-powered chatbot. Boost your productivity and never miss a deadline again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-primeColor transition-all duration-300"
                  href="/guide"
                >
                  Learn More
                </Link>
              </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-2xl lg:w-1/2">
                <div className="bg-gray-100 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <FaRobot className="text-3xl text-primeColor" />
                    <h3 className="text-xl font-semibold text-gray-800">Task Assistant</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-[#1F509A] text-white p-3 rounded-lg rounded-tl-none max-w-xs">
                      How can I help you manage your tasks today?
                    </div>
                    <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-tr-none max-w-xs ml-auto">
                      I need to set a reminder for my meeting tomorrow
                    </div>
                    <div className="bg-primeColor text-white p-3 rounded-lg rounded-tl-none max-w-xs">
                      I&apos;ll set that up for you right away. What time is your meeting?
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:border-primeColor"
                    aria-label="Message input"
                  />
                  <Link
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-thirdColor hover:text-primeColor"
                    href='/auth/login'
                  >
                    <FaArrowRight className="text-xl" />
                  </Link>
                </div>
              </div>
          </div>
        </div>
    </div>
    {/* End Section 1 */}

    {/* Section 2 */}
      <div className="bg-white font-[sans-serif] flex max-lg:flex-col px-4 my-14 gap-12 max-w-[1400px] mx-auto">
        <div>
        <h2 className="text-gray-800 text-4xl font-extrabold mb-6">Discover Our Exclusive Features</h2>
        <p className="text-gray-600 text-sm leading-relaxed">Laboris qui Lorem ad tempor ut reprehenderit. Nostrud anim nulla officia ea sit deserunt. Eu eu quis anim aute Laboris qui Lorem ad tempor ut reprehenderit. Eu eu quis anim aute.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-md:max-w-lg mx-auto">
        <div className="text-left bg-fourthColor rounded-lg shadow p-6">
          <div className="fill-primeColor w-12 inline-block bg-white p-3 rounded-full">
          <FaCog className="text-2xl text-primeColor" />
          </div>
          <h3 className="text-gray-800 text-xl font-semibold mt-6 mb-3">Customization</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Laboris qui Lorem ad tempor ut reprehenderit. Nostrud anim nulla officia ea sit deserunt. Eu eu quis anim aute Laboris qui Lorem ad tempor ut reprehenderit.</p>
        </div>

        <div className="text-left bg-fourthColor rounded-lg shadow p-6">
          <div className="w-12 inline-block bg-white p-3 rounded-full">
          <FaLock className="text-2xl text-primeColor" />
          </div>
          <h3 className="text-gray-800 text-xl font-semibold mt-6 mb-3">Security</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Laboris qui Lorem ad tempor ut reprehenderit. Nostrud anim nulla officia ea sit deserunt. Eu eu quis anim aute Laboris qui Lorem ad tempor ut reprehenderit.</p>
        </div>

        <div className="text-left bg-fourthColor rounded-lg shadow p-6">
          <div className="fill-blue-600 w-12 inline-block bg-white p-3 rounded-full">
          <FaHeadset className="text-2xl text-primeColor" />
          </div>
          <h3 className="text-gray-800 text-xl font-semibold mt-6 mb-3">Support</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Laboris qui Lorem ad tempor ut reprehenderit. Nostrud anim nulla officia ea sit deserunt. Eu eu quis anim aute Laboris qui Lorem ad tempor ut reprehenderit.</p>
        </div>

        <div className="text-left bg-fourthColor rounded-lg shadow p-6">
          <div className="fill-blue-600 w-12 inline-block bg-white p-3 rounded-full">
          <FaTachometerAlt className="text-2xl text-primeColor" />
          </div>
          <h3 className="text-gray-800 text-xl font-semibold mt-6 mb-3">Performance</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Laboris qui Lorem ad tempor ut reprehenderit. Nostrud anim nulla officia ea sit deserunt. Eu eu quis anim aute Laboris qui Lorem ad tempor ut reprehenderit.</p>
        </div>
        <div className="text-left bg-fourthColor rounded-lg shadow p-6">
          <div className="fill-blue-600 w-12 inline-block bg-white p-3 rounded-full">
          <FaTachometerAlt className="text-2xl text-primeColor" />
          </div>
          <h3 className="text-gray-800 text-xl font-semibold mt-6 mb-3">Performance</h3>
          <p className="text-gray-600 text-sm leading-relaxed">Laboris qui Lorem ad tempor ut reprehenderit. Nostrud anim nulla officia ea sit deserunt. Eu eu quis anim aute Laboris qui Lorem ad tempor ut reprehenderit.</p>
        </div>
        </div>
      </div>
      {/* End Section 2 */}
     </>
  )
}

export default AboutSection
