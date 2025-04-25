import { Button } from 'antd';
import './modal.scss';

interface Props {
  okText?: string;
  cancelText?: string;
  okLoading?: boolean;
  okDisabled?: boolean;
  onCancel?: () => void;
  onOk?: () => void;
}

function ModalFooter({
  okText,
  cancelText,
  okLoading,
  okDisabled,
  onCancel,
  onOk,
}: Props) {
  return (
    <div className="modal-footer">
      <Button onClick={() => onCancel?.()} className="modal-cancel-btn">
        {okText || 'Cancel'}
      </Button>
      <Button
        type="primary"
        htmlType="submit"
        loading={okLoading}
        onClick={() => onOk?.()}
        className="modal-add-btn"
        disabled={okDisabled}
      >
        {cancelText || 'Save'}
      </Button>
    </div>
  );
}

export default ModalFooter;
