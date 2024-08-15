import { useState,useEffect } from "react";
import axios from "../api/axios";
import axiosApiInstance from "../context/interceptor";
import ReactLoading from "react-loading";

const BestSelling = () => {

    const [loadBestSell, setLoadBestSell] = useState(true);
    const [listBestSeller, setBestSeller] = useState([]);
    async function getBestSeller() {
        try {
            const result = await axios.get(axiosApiInstance.defaults.baseURL + `/api/product/best-selling`);
            setLoadBestSell(false);
            setBestSeller(result?.data.data)
        } catch (error) {

        }

    }
    

    useEffect(() => {
        getBestSeller();
    }, []);

    return ( 
        <div class="container">
                <div class="row text-center py-3">
                    <div class="col-lg-10 m-auto ">                        
                        <p style={{color:"red",fontSize:"20px"}}>Top sản phẩm bán chạy nhất</p>
                    </div>
                </div>
                <div className="row">
                    {loadBestSell ?
                        <div className={"center loading"}>
                            <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                        </div> :
                        listBestSeller.map((item) => (
                            <div className="col-md-6">
                                <div className="card mb-3 product-wap rounded-0">
                                    <div className="card rounded-1">
                                        <img className="img-config card-img rounded-0 img-fluid"
                                            src={item.linkImg} />
                                    </div>
                                    <div className="card-body">
                                        <div className="">
                                            <a href={`/product/${item?.id}`}
                                                className="h3 text-decoration-none text-config"
                                                title={item.name}>{item.name}</a>
                                        </div>
                                        {
                                                    item?.promotionValue > 0 ?
                                                        <>
                                                            <p className="text-center mb-0 text-decoration-line-through">{item.price.toLocaleString('vi', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            })}</p>
                                                            <p className="text-center mb-0 price_txt">{(item?.price * (100 - item?.promotionValue) / 100).toLocaleString('vi', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            })}</p>
                                                        </> :
                                                        <p className="text-center mb-0 price_txt">{item.price?.toLocaleString('vi', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        })}</p>
                                                }
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
     );
}

 
export default BestSelling;