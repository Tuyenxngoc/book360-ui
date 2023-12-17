import { createTheme } from '@mui/material';
import { viVN } from '@mui/material/locale';

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

export default theme;