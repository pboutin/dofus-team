import React, {useRef} from 'react';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const Drawer = ({ children, onClose }: Props) => {
  const ref = useRef(null);

  return (
    <>
      <div onClick={onClose} className="fixed left-0 top-0 w-screen h-screen bg-black opacity-50 z-40"></div>
      <div ref={ref} className="flex fixed p-3 top-0 right-0 h-screen w-1/2 z-50 bg-base-100">
        <div className="relative flex-grow">
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
