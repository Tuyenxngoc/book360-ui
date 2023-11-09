import { useEffect } from "react";
import request from "~/utils/request";
function BookDetails() {

    useEffect(() => {
        console.log(1);
        request
            .get('https://jsonplaceholder.typicode.com/albums')
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => { console.log(error); });
    }, []);

    return (
        <h1>BookDetails</h1>
    );
}

export default BookDetails;