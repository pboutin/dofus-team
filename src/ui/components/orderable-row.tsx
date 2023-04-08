import React from 'react';

interface OrderItem {
  id: string;
}

interface Props {
  children: React.ReactNode;
  item: OrderItem;
  items: OrderItem[];
  onOrderChange: (reorderedIds: string[]) => void;
}

const OrderableRow = ({ children, item, items, onOrderChange }: Props) => {
  const index = items.findIndex(({id}: {id: string}) => id === item.id);

  const handleMoveUp = () => {
    const newItems = [...items];
    newItems.splice(index, 1);
    newItems.splice(index - 1, 0, item);
    onOrderChange(newItems.map(({id}) => id));
  };

  const handleMoveDown = () => {
    const newItems = [...items];
    newItems.splice(index, 1);
    newItems.splice(index + 1, 0, item);
    onOrderChange(newItems.map(({id}) => id));
  };

  return (
    <tr>
      <td width={90}>
        <div className="btn-group">
          <button className="btn btn-secondary btn-sm btn-square" onClick={handleMoveUp} disabled={index === 0}>
            <i className="fa-solid fa-arrow-up" />
          </button>
          <button className="btn btn-secondary btn-sm btn-square" onClick={handleMoveDown} disabled={index === items.length - 1}>
            <i className="fa-solid fa-arrow-down" />
          </button>
        </div>
      </td>
      {children}
    </tr>
  );
};

export default OrderableRow;
