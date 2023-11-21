import images from "~/assets/images";
function Error() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img width="100px" src={images.error} alt="" />
            <h3>Lỗi, lấy dữ liệu không thành công! Hãy kiểm tra kết nối mạng của bạn🙌</h3>
        </div>
    );
}

export default Error;