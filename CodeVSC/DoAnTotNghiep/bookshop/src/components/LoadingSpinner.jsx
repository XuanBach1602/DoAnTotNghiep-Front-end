// LoadingSpinner.js
import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useLoading } from '../LoadingContext';

const LoadingSpinner = () => {
  const { isLoading } = useLoading();
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  return isLoading ? (
    <div style={{
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <Spin indicator={antIcon} />
        <div>Loading</div>
      </div>
    </div>
  ) : null;
};

export default LoadingSpinner;
