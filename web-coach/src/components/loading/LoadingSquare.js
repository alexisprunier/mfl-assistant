import React from 'react';
import "./LoadingSquare.css";

interface LoadingSquareProps {}

const LoadingSquare: React.FC<LoadingSquareProps> = () => {
  return (
    <div className="LoadingSquare d-inline-block rounded-2 h-100 w-100"/>
  );
};

export default LoadingSquare;