import React from 'react';
import './Button.css';

function Button({ children, variant = 'primary', size = 'md', disabled = false, ...props }) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
