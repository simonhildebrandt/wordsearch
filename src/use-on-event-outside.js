import { useEffect } from 'react';

export default function useOnEventOutside(ref, handler, events=["mousedown", "touchstart"]) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      events.forEach(event => {
        document.addEventListener(event, listener);
        })
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, listener);
        })
      };
    },
    [ref, handler]
  );
}
