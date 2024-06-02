import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

const PaymentNotify = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    const [loading, setLoading] = useState(true);

    // Lấy giá trị của tham số 'success' từ URL
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success');

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown(prevCountdown => {
                if (prevCountdown <= 1) {
                    clearInterval(intervalId); // Dừng bộ đếm
                    navigate('/');
                    return 0; // Trả về 0 để đảm bảo bộ đếm không tiếp tục giảm sau khi điều hướng
                }
                return prevCountdown - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId); // Clear interval when component unmounts
    }, [navigate]);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
             <Spin size="large" />
            { success === 'true' ? (
                <div>
                    <p>Thanh toán thành công</p>
                    <p>Trang sẽ trở về trang chủ trong {countdown} giây nữa</p>
                </div>
            ) : (
                <div>
                    <p>Thanh toán thất bại. Hãy thử lại sau</p>
                    <p>Trang sẽ trở về trang chủ trong {countdown} giây nữa</p>
                </div>
            )}
        </div>
    );
};

export default PaymentNotify;
