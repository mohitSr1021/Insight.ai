import React from 'react';

interface PopupBoxProps {
  show: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const PopupBox: React.FC<PopupBoxProps> = ({ show, onClose, title, content }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/65 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-700 mb-4">{content}</p>
        <div className="mt-4">
          <p className="text-gray-600 mb-2">
            Welcome to my learning project! This platform is a work in progress, and I'm constantly working on adding new features and improving the user experience.
          </p>
          <p className="text-gray-600 mb-2">
            Some features might be incomplete or have limited functionality at the moment, but that's part of the journey as I continue to learn and grow.
          </p>
          <p className="text-gray-600 mb-4">
            I appreciate your patience and understanding as I build and experiment with new technologies. Stay tuned for more updates and feel free to explore what's available so far!
          </p>
        </div>
        <div className="mt-4">
          <p className="text-gray-600 mb-2">
            If you have any feedback or suggestions, I'd love to hear from you. Your input will help me improve and continue to learn.
          </p>
          <p className="text-gray-600 mb-4">
            You can reach out to me at: <strong>Mohit Singh Rawat</strong> (<a href="mailto:mohit.sr.lvp1021@gmail.com" className="text-blue-500 hover:text-blue-600">mohit.sr.lvp1021@gmail.com</a>)
          </p>
        </div>
        <div className="flex justify-between items-center">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={onClose}
          >
            Got It!
          </button>
          <div>
            <span className='w-[40px] h-[40px] shadow hover:bg-gray-200 cursor-pointer bg-gray-50 rounded-full flex items-center justify-center'>
              0_0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupBox;
