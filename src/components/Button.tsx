import React from "react";

interface ButtonProps {
  onSave: () => void;
}

const Button: React.FC<ButtonProps> = ({ onSave }) => {
  return (
    <button onClick={onSave} className="button">
      Save
    </button>
  );
};

export default Button;
