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
      <div className="fixed left-0 top-0 z-50 h-screen w-screen bg-black opacity-50"></div>
      <div className="fixed right-0 top-0 z-50 flex h-screen w-2/3 bg-base-100">
        <div className="flex-1 overflow-y-scroll p-3">{children}</div>
      </div>
    </>
  );
};

export default Drawer;
