import Header from "../Component/Header";
import Footer from "./Footer";

function DefaultLayout({ children }) {
    return (
        <>
            <Header></Header>
            <div className="content">
                {children}
            </div>
            <Footer></Footer>
        </>
    );
}

export default DefaultLayout
    ;