import ProductCategory from '~/components/ProductCategory';
import HomeProduct from '~/components/HomeProduct';
import Slide from '~/components/Slider';

function Home() {
    return (
        <main className='Home'>
            <ProductCategory>{<Slide></Slide>}</ProductCategory>
            <HomeProduct
                title={'ƯU ĐÃI'}
                apiUrl={'product/get-products?sortBy=discount'}
                moreLink={'/search?sortBy=discount'}
            />
            <HomeProduct
                title={'SÁCH MỚI'}
                apiUrl={'product/get-products?sortBy=createdDate'}
                moreLink={'/search?sortBy=createdDate'}
            />
            <HomeProduct
                title={'SÁCH BÁN CHẠY'}
                apiUrl={'product/get-products?sortBy=selled'}
                moreLink={'/search?sortBy=selled'}
            />
            <HomeProduct
                title={'KIẾN THỨC KHOA HỌC'}
                bannerIndex={3}
                apiUrl={'product/get-products-by-categoryId/3'}
                moreLink={'/category/3'}
            />
            <HomeProduct
                title={'MANGA - COMIC'}
                bannerIndex={4}
                apiUrl={'product/get-products-by-categoryId/5'}
                moreLink={'/category/5'}
            />
            <HomeProduct
                title={'WINGSBOOKS'}
                bannerIndex={6}
                apiUrl={'product/get-products-by-categoryId/6'}
                moreLink={'/category/6'}
            />
        </main>
    );
}

export default Home;