import ProductCategory from '~/components/User/ProductCategory';
import HomeProduct from '~/components/User/HomeProduct';
import Slide from '~/components/Common/Slider';
import React, { useEffect, useState } from 'react';
import { homeConfig } from '~/config';

const componentMap = {
    ProductCategory,
    HomeProduct,
    Slide,
};

function Home() {
    const [homeSections, setHomeSections] = useState([]);

    useEffect(() => {
        setHomeSections(homeConfig);
    }, []);

    return (
        <main>
            {homeSections.map((section, index) => {
                const Component = componentMap[section.component];
                if (Component) {
                    const props = { ...section.props };
                    if (props.children && componentMap[props.children]) {
                        props.children = React.createElement(componentMap[props.children]);
                    }
                    return <Component key={index} {...props} />;
                }
                return null;
            })}
        </main>
    );
}

export default Home;
