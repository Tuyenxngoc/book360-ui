import { useEffect, useState } from "react";
import request from "~/utils/request";

import style from './Home.module.scss'
import classNames from 'classnames/bind';

import Product from "~/components/Product";


const cx = classNames.bind(style);

function Home() {
    const [data, setData] = useState([]);
    useEffect(() => {
        request
            .get('https://jsonplaceholder.typicode.com/albums')
            .then((response) => {
                setData(response.data)
            })
            .catch((error) => { console.log(error); });
    }, []);

    return (
        <div>{data.map((product) => {
            return <Product
                key={product.id}
                id={product.id}
                name={product.title}
                img={product.img}
                currentPrice={product.price}
                originalPrice={product.originalPrice}
            ></Product>
        })}</div>
    );
}

export default Home;