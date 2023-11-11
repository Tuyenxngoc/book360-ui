import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();
    const [secondsRemaining, setSecondsRemaining] = useState(5); // Số giây ban đầu

    useEffect(() => {
        let isMounted = true;

        const timeoutId = setTimeout(() => {
            if (isMounted) {
                navigate('/');
            }
        }, secondsRemaining * 1000);

        const intervalId = setInterval(() => {
            if (isMounted) {
                setSecondsRemaining((prevSeconds) => Math.max(0, prevSeconds - 1));
            }
        }, 1000);

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [navigate, secondsRemaining]);

    return (
        <div>
            <div>Không tìm thấy trang! Đang chuyển hướng về trang home...</div>
            <div>Chuyển hướng trong {secondsRemaining} giây</div>
        </div>
    );
}

export default NotFound;
