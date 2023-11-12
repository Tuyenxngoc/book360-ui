import ProductCategory from '~/components/ProductCategory';
import HomeProduct from '~/components/HomeProduct';
import Slide from '~/components/Slider';

function Home() {
    return (
        <div className='Home'>
            <ProductCategory>{<Slide></Slide>}</ProductCategory>
            <HomeProduct title={'ƯU ĐÃI'} url={'product/get-products?sortBy=discount'}></HomeProduct>
            <HomeProduct title={'SÁCH MỚI'} url={'product/get-products?sortBy=createdDate'}></HomeProduct>
            <HomeProduct title={'SÁCH BÁN CHẠY'} url={'product/get-products?sortBy=selled'}></HomeProduct>
        </div>
    );
}

export default Home;