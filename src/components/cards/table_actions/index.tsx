import { Button, Popconfirm, Tooltip } from 'antd';
import { Eye, Forbidden, Forbidden2, MessageText1 } from 'iconsax-react';
import { useState } from 'react';
import './table_actions.scss';

interface Props {
  onView?: () => void;
  onMessage?: () => void;
  onBlock?: () => void;
  blockLoading?: boolean;
  isBlocked?: boolean;
}

function TableActions({
  onView,
  onMessage,
  onBlock,
  blockLoading,
  isBlocked,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onBlock?.();
    setOpen(false);
  };

  return (
    <>
      <div className="table_action">
        {onView && (
          <Tooltip title="Ko'rish">
            <Button className="table_action-btn-blue" onClick={onView}>
              <Eye size="16" />
            </Button>
          </Tooltip>
        )}

        {onMessage && (
          <Tooltip title="Xabar yuborish">
            <Button className="table_action-btn-yellow" onClick={onMessage}>
              <MessageText1 size="16" />
            </Button>
          </Tooltip>
        )}

        {onBlock && (
          <Tooltip title={isBlocked ? 'Blokdan chiqarish' : 'Bloklash'}>
            <Button
              className="table_action-btn-red"
              onClick={() => setOpen(true)}
              loading={blockLoading}
            >
              {isBlocked ? <Forbidden2 size="16" /> : <Forbidden size="16" />}
            </Button>
          </Tooltip>
        )}
      </div>

      <Popconfirm
        title={`Foydalanuvchini ${
          isBlocked ? 'blokdan chiqarish' : 'bloklash'
        }`}
        description={`Foydalanuvchini ${
          isBlocked ? 'blokdan chiqarish' : 'bloklash'
        } tasdiqlaysizmi?`}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        okText="Ha"
        cancelText="Yo'q"
        open={open}
      />
    </>
  );
}

export default TableActions;
