import React from "react";
import './styles.css';

export default function Button({ text, onClick, disabled,width }) {
  return (
    <div onClick={onClick} disabled={disabled} style={{width:width}} className="custom-btn">
      {text}
    </div>
  );
}
