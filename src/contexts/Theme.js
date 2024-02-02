import { createTheme } from '@mui/material';
import { viVN } from '@mui/material/locale';
import viVnAntd from 'antd/lib/locale/vi_VN';

const theme = createTheme(
    {
        palette: {
            primary: {
                main: '#00afef',
                light: '#36d8ff',
                dark: '#05bcff',
                contrastText: '#fff',
            },
        },
    },
    viVN,
);

const antdConfig = {
    theme: {
        token: {
            colorPrimary: '#00afef',
        },
    },
    locale: viVnAntd
}

export { antdConfig };
export default theme;