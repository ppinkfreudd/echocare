import React from 'react';

interface MicButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const MicButton: React.FC<MicButtonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className="m-2">
      {children}
    </button>
  );
};

export default MicButton;
