import ProductCategory from '~/components/User/ProductCategory';
import HomeProduct from '~/components/User/HomeProduct';
import Slide from '~/components/Common/Slider';
import Chat from '~/components/User/Chat';

function Home() {
    return (
        <main>
            <ProductCategory>{<Slide></Slide>}</ProductCategory>
            <HomeProduct
                title={'ƯU ĐÃI'}
                sortBy={'discount'}
                moreLink={'/search?sortBy=discount'}
            />
            <HomeProduct
                title={'SÁCH MỚI'}
                sortBy={'createdDate'}
                moreLink={'/search?sortBy=createdDate'}
            />
            <HomeProduct
                title={'SÁCH BÁN CHẠY'}
                sortBy={'soldQuantity'}
                moreLink={'/search?sortBy=soldQuantity'}
            />
            <HomeProduct
                showProductByCategory={true}
                categoryId={3}
                sortBy={'createdDate'}
                moreLink={'/category/3'}
            />
            <HomeProduct
                showProductByCategory={true}
                categoryId={4}
                sortBy={'createdDate'}
                moreLink={'/category/4'}
            />
            <HomeProduct
                showProductByCategory={true}
                categoryId={5}
                sortBy={'createdDate'}
                moreLink={'/category/5'}
            />
            <HomeProduct
                showProductByCategory={true}
                categoryId={6}
                sortBy={'createdDate'}
                moreLink={'/category/6'}
            />

            <Chat />
        </main>
    );
}

export default Home;