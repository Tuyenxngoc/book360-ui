import style from './Home.module.scss'
import classNames from 'classnames/bind';
const cx = classNames.bind(style);
function Home() {
    return (
        <div className={cx('grid')}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-2">
                                item 2
                            </div>
                            <div className="col-md-10">
                                <div className="row">
                                    <div className="col-md-3">
                                        item 123
                                    </div>
                                    <div className="col-md-3">
                                        item 123
                                    </div>
                                    <div className="col-md-3">
                                        item 123
                                    </div>
                                    <div className="col-md-3">
                                        item 123
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;