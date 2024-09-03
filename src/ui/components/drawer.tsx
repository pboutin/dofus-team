import React, { useEffect } from 'react';
import { useKey } from 'react-use';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const Drawer = ({ children, onClose }: Props) => {
  useKey('Escape', onClose);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  });

  return (
    <>
      <div className="fixed left-0 top-0 w-screen h-screen bg-black opacity-50 z-50"></div>
      <div className="flex fixed top-0 right-0 h-screen w-2/3 z-50 bg-base-100">
        <div className="p-3 flex-1 overflow-y-scroll">{children}</div>
      </div>
    </>
  );
};

export default Drawer;
