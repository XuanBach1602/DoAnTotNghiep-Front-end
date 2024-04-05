import React, { Children, useState } from 'react';
import { Modal, Button } from 'antd';

const CustomizeModal = ({ visible, onCancel, onConfirm, content }) => {
  return (
    <Modal
      open={true}
      title="Tiêu đề của Modal"
      onCancel={onCancel}
      className="centered-modal"
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="confirm" type="primary" onClick={onConfirm}>
          Xác nhận
        </Button>,
      ]}
    >
        <div dangerouslySetInnerHTML={{ __html: content }} />
    </Modal>
  );
};

export default CustomizeModal;
