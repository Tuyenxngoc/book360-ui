import PropTypes from 'prop-types';

import { Card, Space, Statistic } from 'antd';
import { Tooltip, Line, LineChart, ResponsiveContainer } from 'recharts';

import Style from './AdminDashBoardCard.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

function DashBoardCard({ icon, title, value, data }) {
    return (
        <Card className={cx('cart-content')}>
            <Space direction="horizontal">
                {icon}
                <Statistic title={title} value={value} />
                <div style={{ width: '100px', height: '50px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart width={300} height={100} data={data}>
                            \
                            <Tooltip
                                contentStyle={{ background: 'transparent', border: 'none' }}
                                labelStyle={{ display: 'none' }}
                            />
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Space>
        </Card>
    );
}

DashBoardCard.propTypes = {
    icon: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default DashBoardCard;
