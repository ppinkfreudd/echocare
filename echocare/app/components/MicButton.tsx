import React from 'react';

interface MicButtonProps extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
  isActive?: boolean;
}

const MicButton: React.FC<MicButtonProps> = ({ onClick, className, children }) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default MicButton;
