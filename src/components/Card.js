import React from 'react';
import './Card.css';

function Card({ children, className, title, icon }) {
  return (
    <div className={`card ${className}`}>
      {(title || icon) && (
        <div className="card-header">
          {icon && <div className="card-icon">{icon}</div>}
          {title && <h3 className="card-title">{title}</h3>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default Card;
