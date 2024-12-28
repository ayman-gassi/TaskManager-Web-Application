import React, { useEffect, useState } from 'react';
import { PiStarFourFill } from "react-icons/pi";
const Alert = ({ message, duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    return (
        <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg transition-opacity duration-500 ease-in-out opacity-100 transform translate-y-0 animate-fadeIn">
            <PiStarFourFill className="inline-block text-xl mr-1" />
            {message}
        </div>
    );
};

export default Alert;