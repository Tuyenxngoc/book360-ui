import ProductCategory from '~/components/ProductCategory';
import HomeProduct from '~/components/HomeProduct';
import Slide from '~/components/Slider';

function Home() {
    return (
        <div className='Home'>
            <ProductCategory>{<Slide></Slide>}</ProductCategory>
            <HomeProduct
                title={'ƯU ĐÃI'}
                url={'product/get-products?sortBy=discount'}
            />
            <HomeProduct
                title={'SÁCH MỚI'}
                url={'product/get-products?sortBy=createdDate'}
            />
            <HomeProduct
                title={'SÁCH BÁN CHẠY'}
                url={'product/get-products?sortBy=selled'}
            />
            <HomeProduct
                title={'KIẾN THỨC KHOA HỌC'}
                banner={3}
                url={'product/get-products-by-categoryId/3'}
            />
            <HomeProduct
                title={'MANGA - COMIC'}
                banner={4}
                url={'product/get-products-by-categoryId/5'}
            />
            <HomeProduct
                title={'WINGSBOOKS'}
                banner={6}
                url={'product/get-products-by-categoryId/6'}
            />
        </div>
    );
}

export default Home;