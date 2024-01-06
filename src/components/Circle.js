
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CircleContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: lightgray;
  margin: 50px auto; /* Adjust as needed */
`;

const CircularButton = styled.button`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: lightblue;
  color: white;
  border: none;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease-in-out;
`;

const CircularButtonGroup = ({ buttons, onClick }) => {
  const [positions, setPositions] = useState([]);

  const centerX = 100; // Adjust as needed
  const centerY = 100; // Adjust as needed
  const fixedRadius = 80; // Adjust as needed
  const speed = 0.01; // Adjust as needed

  useEffect(() => {
    const calculatePosition = (index, time) => {
      const angle = (index / buttons.length) * 2 * Math.PI + speed * time;
      const x = centerX + fixedRadius * Math.cos(angle);
      const y = centerY + fixedRadius * Math.sin(angle);
      return { x, y };
    };

    const animate = (time) => {
      const buttonPositions = buttons.map((button, index) => calculatePosition(index, time));
      setPositions(buttonPositions);
      requestAnimationFrame((newTime) => animate(newTime));
    };

    animate(0); // Start the animation loop

    return () => {
      // Cleanup on component unmount
      cancelAnimationFrame();
    };
  }, [buttons, centerX, centerY, fixedRadius, speed]);

  return (
    <CircleContainer>
      {buttons.map((button, index) => (
        <CircularButton
          key={index}
          style={{ left: `${positions[index]?.x}px`, top: `${positions[index]?.y}px` }}
          onClick={() => onClick(button)}
        >
          {button}
        </CircularButton>
      ))}
    </CircleContainer>
  );
};

const MyComponent = () => {
  const handleClick = (arg) => {
    console.log(`Clicked with argument: ${arg}`);
  };

  const buttons = ['Button 1', 'Button 2', 'Button 3', 'Button 4'];

  return <CircularButtonGroup buttons={buttons} onClick={handleClick} />;
};

export default MyComponent;

