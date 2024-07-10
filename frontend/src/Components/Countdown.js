import React, { useState, useEffect } from "react";

const Countdown = ({ deliveryTime, predictedAt }) => {
  const [timeLeft, setTimeLeft] = useState(deliveryTime);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeElapsed = Math.floor(
        (Date.now() - new Date(predictedAt)) / 1000
      );
      setTimeLeft(deliveryTime - timeElapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [deliveryTime, predictedAt]);

  if (timeLeft <= 0) {
    return <span>Time's up!</span>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span>
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </span>
  );
};

export default Countdown;
