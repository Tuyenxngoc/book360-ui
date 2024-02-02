import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from '~/reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
import GlobalStyles from '~/style/GlobalStyle';
import { AuthProvider } from '~/contexts/AuthProvider';
import { CartProvider } from './contexts/CartContext';

import { ConfigProvider } from 'antd';
import { ThemeProvider } from '@mui/material/styles';
import theme, { antdConfig } from './contexts/Theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyles>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider theme={theme}>
            <ConfigProvider {...antdConfig}>
              <App />
            </ConfigProvider>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </GlobalStyles>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
