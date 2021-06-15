/*** 
 * This is a custom hook that can be used for dropdowns and modals. 
 * It returns a ref which you can put on the component.
 * 
 * example usage:
 *  import React, { useState } from 'react';
 *  import { useClickOutside } from '../hooks/useClickOutSide'
 * 
 *  const Component = () => {
        const [visible, setVisible] = useState(true)
 *      const hide = () => {
            setVisible(false)
 *      }
 *      const ref = useClickOutSide(hide) 
 *      return (
 *          <>
 *              {visible && <div ref={ref}>
 *                  modal or something...
 *              </div>}
 *          </>
 *      )
 *  }
*/
import { useRef, useEffect } from 'react';
export const useClickOutside = (handler) => {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);
  return ref;
};

/*  
idea from https://medium.com/@pitipatdop/little-neat-trick-to-capture-click-outside-with-react-hook-ba77c37c7e82
*/