import { Fragment } from "react"
import PropTypes from 'prop-types';

import classNames from "classnames/bind";
import style from "./DefaultLayout.module.scss"

import Header from "~/components/Header";
import Footer from "~/components/Footer";

const cx = classNames.bind(style);

function DefaultLayout({ children }) {
    return (
        <Fragment>
            <Header></Header>
            <div className={cx('wrapper')}>
                {children}
            </div>
            <Footer></Footer>
        </Fragment>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired
}

export default DefaultLayout;