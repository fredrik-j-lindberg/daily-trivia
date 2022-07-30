import {
  useEffect, useRef,
} from 'react';

export default <T extends HTMLElement>(callback: () => void) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const { target } = event;
      if (!target || !('nodeType' in target)) return;
      if (!ref.current || ref.current.contains(target)) return;
      callback();
    };
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return ref;
};
