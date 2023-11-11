import ProductCategory from '~/components/ProductCategory';
import HomeProduct from '~/components/HomeProduct';
import Slide from '~/components/Slider';

function Home() {
    return (
        <div className='Home'>
            <ProductCategory>{<Slide></Slide>}</ProductCategory>
            <HomeProduct title={'SÁCH MỚI'}></HomeProduct>
            <HomeProduct title={'BÁN CHẠY'}></HomeProduct>
            <HomeProduct title={'COMBO'}></HomeProduct>
            <HomeProduct title={'DORAEMON'}></HomeProduct>
        </div>
    );
}

export default Home;