import { Link } from 'react-router-dom';

function Forbidden() {
    return (
        <div className='container'>
            <div className='row'>
                <div className='col'>
                    <div className='text-center'>
                        <h1>Bạn không có quyền để truy cập vào trang này</h1>
                        <Link to='/'>Trở về trang chủ</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Forbidden;