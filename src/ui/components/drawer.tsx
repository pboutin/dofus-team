import React from 'react';
import { useKey } from 'react-use';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const Drawer = ({ children, onClose }: Props) => {
  useKey('Escape', onClose);

  return (
    <>
      <div className="fixed left-0 top-0 w-screen h-screen bg-black opacity-50 z-40"></div>
      <div className="flex fixed p-3 top-0 right-0 h-screen w-2/3 z-50 bg-base-100">
        <div className="relative flex-grow">
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
