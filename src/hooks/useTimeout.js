import { useState, useEffect, useCallback, useRef } from "react";

const useTimeout = (callback, delay = 100) => {
  const [isRun, setIsRun] = useState(false);
  const [isRestart, setIsRestart] = useState(false);
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const restart = useCallback(() => {
    setIsRun(false);
    setIsRestart(true);
  }, []);

  const start = useCallback(() => {
    setIsRun(true);
    setIsRestart(false);
  }, []);

  const callTimeout = useCallback(() => {
    if (isRun) {
      restart();
    } else {
      start();
    }
  }, [isRun]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (isRun) {
      let id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }

    if (isRestart) {
      start();
    }
  }, [isRun, isRestart]);

  return [callTimeout];
};

export default useTimeout;
