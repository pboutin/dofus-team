import React, { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import Icon from 'components/icon';
import classNames from 'classnames';

interface BodyProps {
  children: React.ReactNode;
  ids: string[];
  onReorder: (reorderedIds: string[]) => void;
}

const Body = ({ children, ids, onReorder }: BodyProps) => {
  return (
    <Reorder.Group as="tbody" onReorder={onReorder} axis="y" values={ids}>
      {children}
    </Reorder.Group>
  );
};

interface RowProps {
  children: React.ReactNode;
  id: string;
}

const Row = ({ children, id }: RowProps) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item value={id} as="tr" dragListener={false} dragControls={dragControls} className="hover">
      <td
        width={60}
        onPointerDown={(event) => {
          dragControls.start(event);
          event.preventDefault();
        }}
        className="text-center text-lg cursor-move"
      >
        <Icon icon="grip" />
      </td>
      {children}
    </Reorder.Item>
  );
};

export default { Body, Row };
