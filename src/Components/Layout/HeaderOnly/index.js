import Header from "../Component/Header";

function HeaderOnly({ children }) {
    return (
        <>
            <Header></Header>
            <div className="content">
                {children}
            </div>
        </>
    );
}

export default HeaderOnly
    ;