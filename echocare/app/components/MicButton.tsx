import React from 'react';
import { MicIcon, PhoneOff } from 'lucide-react';

interface MicButtonProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  isActive?: boolean;
}

const MicButton: React.FC<MicButtonProps> = ({ isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
    >
      {isActive ? <PhoneOff size={18} /> : <MicIcon size={18} />}
    </button>
  );
};

export default MicButton;
