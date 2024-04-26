import images from "~/assets";

function Loading() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#fdfdfd' }}>
            <img src={images.loading} alt="loading" />
        </div>
    );
}

export default Loading;