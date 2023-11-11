import ProductCategory from '~/components/ProductCategory';
import HomeProduct from '~/components/HomeProduct';
import Slide from '~/components/Slider';

function Home() {
    return (
        <>
            <ProductCategory>{<Slide></Slide>}</ProductCategory>
            <HomeProduct title={'SÁCH MỚI'}></HomeProduct>
            <HomeProduct title={'BÁN CHẠY'}></HomeProduct>
            <HomeProduct title={'COMBO'}></HomeProduct>
            <HomeProduct title={'DORAEMON'}></HomeProduct>
        </>
    );
}

export default Home;