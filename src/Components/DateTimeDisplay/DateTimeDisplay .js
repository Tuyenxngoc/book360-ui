import { format } from 'date-fns';
import PropTypes from 'prop-types';

function DateTimeDisplay({ datetime }) {
    // Chuyển đổi giá trị datetime thành đối tượng Date
    const parsedDate = new Date(datetime);

    // Sử dụng date-fns để định dạng ngày tháng năm
    const formattedDateTime = format(parsedDate, 'HH:mm dd-MM-yyyy');

    return (
        <>{formattedDateTime}</>
    );
};

DateTimeDisplay.propTypes = {
    datetime: PropTypes.string.isRequired,
}

export default DateTimeDisplay;
