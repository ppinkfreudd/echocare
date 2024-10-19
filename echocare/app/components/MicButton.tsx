import React from 'react';

interface MicButtonProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

const MicButton: React.FC<MicButtonProps> = ({ onClick, className, children }) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default MicButton;
