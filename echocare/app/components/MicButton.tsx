import React from 'react';

interface MicButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const MicButton: React.FC<MicButtonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className="focus:outline-none">
      {children}
    </button>
  );
};

export default MicButton;
