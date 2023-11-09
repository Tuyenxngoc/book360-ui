import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import style from './Button.module.scss';


const cx = classNames.bind(style);

function Button({ to, href,
    text = false,
    rounded = false,
    disabled = false,
    primary = false,
    outLine = false,
    small = false,
    large = false,
    children,
    leftIcon,
    rightIcon,
    onClick,
    ...passProps }) {
    let Comp = 'button';
    const props = {
        onClick,
        ...passProps
    };

    if (disabled) {
        Object.keys(props).forEach(key => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        })
    }

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a'
    }

    const classes = cx('wrapper', { text, rounded, disabled, primary, outLine, small, large })

    return (<Comp {...props} className={classes}>
        {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
    </Comp>);
}

export default Button;