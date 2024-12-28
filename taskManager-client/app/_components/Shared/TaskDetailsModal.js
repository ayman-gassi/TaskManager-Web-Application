import { FiX, FiClock, FiCheckCircle } from 'react-icons/fi';
import { BsClockHistory } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';

const TaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null;

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}`;
  };

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(task.endDate);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-800">Task Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Category/System */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {task.category || 'Design System'}
              </span>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
              <p className="text-lg text-gray-900">{task.title}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
            </div>

            {/* Dates and Time Left */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start and End Dates */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Dates</h3>
                <div className="space-y-2">
                  {task.startDate && (
                    <div className="flex items-center text-gray-700">
                      <FiClock className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm">
                        Start Date: <span className="font-medium">{formatDate(task.startDate)}</span>
                      </span>
                    </div>
                  )}
                  {task.endDate && (
                    <div className="flex items-center text-gray-700">
                      <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm">
                        Deadline: <span className="font-medium">{formatDate(task.endDate)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Days Left */}
              {daysLeft !== null && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Time Remaining</h3>
                  <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
                    daysLeft > 7 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    <BsClockHistory className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${task.status === 'todo' ? 'bg-blue-100 text-blue-800' :
                  task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  task.status === 'done' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'}`}>
                {task.status === 'todo' ? 'To Do' :
                 task.status === 'in-progress' ? 'In Progress' :
                 task.status === 'done' ? 'Done' : 'Pinned'}
              </span>
            </div>

            {/* Priority */}
            {task.priority && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default TaskDetailsModal;
