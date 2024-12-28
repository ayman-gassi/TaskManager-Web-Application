import { FiSettings, FiMoreHorizontal } from 'react-icons/fi'

export default function TaskHeader() {
  return (
    <div className="bg-white px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <div className="flex items-center space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
            <span className="mr-1">+</span>
            New Task
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <FiSettings className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <FiMoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
