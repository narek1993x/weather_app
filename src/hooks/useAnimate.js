import { useState, useCallback } from "react";

const useAnimate = (delay = 1000) => {
  const [animate, setAnimate] = useState(false);

  const callAnimate = useCallback(() => {
    setAnimate(true);
    setTimeout(() => {
      setAnimate(false);
    }, delay);
  }, []);

  return [animate, callAnimate];
};

export default useAnimate;
