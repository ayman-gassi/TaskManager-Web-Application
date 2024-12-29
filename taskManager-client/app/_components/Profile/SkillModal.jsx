'use client';
import React, { useState, useEffect } from 'react';
import { FiX, FiAward, FiEdit2, FiPlus, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function SkillModal({ isOpen, onClose, skills, onUpdateSkills }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [editedSkills, setEditedSkills] = useState(skills);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update editedSkills when skills prop changes
  useEffect(() => {
    setEditedSkills(skills);
  }, [skills]);

  if (!isOpen) return null;

  const validateSkill = (skill) => {
    if (editedSkills.includes(skill.trim())) {
      setErrorMessage('This skill already exists');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return false;
    }

    if (skill.trim().length > 20) {
      setErrorMessage('Skill name must be less than 20 characters');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return false;
    }

    return true;
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (!trimmedSkill) return;

    if (!validateSkill(trimmedSkill)) {
      setNewSkill('');
      return;
    }

    setEditedSkills([...editedSkills, trimmedSkill]);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditedSkills(editedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    try {
      await onUpdateSkills(editedSkills);
      setIsEditing(false);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update skills');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-full">
              <FiAward className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
              <p className="text-sm text-gray-500 mt-0.5">{editedSkills.length} skills</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
                Edit Skills
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                <FiCheck className="w-4 h-4" />
                Save Changes
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow scrollbar-hide hover:scrollbar-default transition-all">
          {isEditing && (
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a new skill..."
                  className="flex-1 px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <AnimatePresence>
              {editedSkills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg group hover:bg-blue-100 transition-colors"
                >
                  <span className="flex-grow text-blue-600 font-medium">{skill}</span>
                  {isEditing ? (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="p-1 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      #{index + 1}
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Error Notification */}
        {showError && (
          <div className="fixed top-4 right-4 flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg shadow-lg animate-slide-in">
            <FiX className="w-5 h-5" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
