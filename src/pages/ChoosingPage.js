import React, { useEffect, useState } from "react";
import userLayout from "../user/userLayout"
import "./../assets/css/user-view.css";
import axiosApiInstance from "../context/interceptor";
import { Form } from "react-bootstrap"
import InputSpinner from "react-bootstrap-input-spinner";
import { toast } from "react-toastify";
import axios from "../api/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";


const ChoosingPage = () => {
    let param = useLocation().pathname.split("/").at(2);
    const navigate = useNavigate()
    const [product, setProduct] = useState()
    const [productDetail, setProductDetail] = useState([])
    const [sizeAvail, setSizeAvail] = useState();
    const [item, setItem] = useState({})
    const [load, setLoad] = useState(true);
    const [order, setOrder] = useState([])
    const [loadSize, setLoadSize] = useState(false);
    const [price, setPrice] = useState('');
    const [promotionValue, setPromotionValue] = useState('');


    async function getProductDetail() {
        try {
            const result = await axios.get(axiosApiInstance.defaults.baseURL + `/api/product/detail/${param}`);
            setProductDetail(result?.data?.data)
            console.log("có không :", result?.data?.data)
            setLoad(false)
            setLoadSize(true)
            setSizeAvail(result?.data?.data.detailInventory)
            setPrice(result?.data?.data?.price)
            setPromotionValue(result?.data?.data?.promotionValue)
        } catch (error) {

        }
    }

    async function getProduct() {
        try {
            const result = await axios.get(axiosApiInstance.defaults.baseURL + `/api/product/${param}`);
            setProduct(result?.data?.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        getProduct()
        getProductDetail()
    }, [])
    useEffect(() => {
        getProduct()
        getProductDetail()
    }, [param])


    const handleAddCart = async (id, amount) => {
        try {
            console.log("id test:", id)
            console.log("quantity test:", amount)
            const body = {
                productDetailID: id,
                quantity: amount
            }
            const result = await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + `/api/cart/update`, body);
            console.log("result :", result)
            return result
        } catch (error) {

        }
    }



    // const handleChangeColor = (e) => {
    //     item.color = e.target.id
    //     setItem(item)
    //     setSizeAvail(productDetail.filter(i => i.color === e.target.id))
    // }
    const handleChangeSize = (e) => {
        item.size = e.target.id
        setItem(item)
        console.log("id:", e.target.id)
    }
    const handleChangeAmount = (e) => {
        item.amount = e
        setItem(item)
        console.log("SL là :", e)
    }

    const buyNow = (e) => {
        try {
            const tmp = {};
            if (item.color && item.size) {
                tmp.amount = item.sl ? item.sl : 1
                tmp.product = productDetail.find(i => i.color === item.color && i.size === item.size)
                order.push(tmp)
                setOrder(order)
                navigate('/theorder', { state: order });
            } else {
                toast.error("Vui lòng chọn đủ thông tin")
            }
            e.preventDefault()
        } catch (error) {

        }
    }



    const handleSubmitAdd = async (e) => {
        e.preventDefault()
        const newItem = productDetail?.detailInventory.find(i => i.size === item.size)
        console.log("New Item :", newItem)
        if (newItem) {
            console.log("quantity:", item.amount)
            if (newItem?.inventory < item?.amount || newItem?.inventory < 1)
                toast.error("Sản phẩm không đủ số lượng bạn cần! \n Vui lòng giảm số lượng!")
            else {
                let kq = null;
                try {
                    kq = await handleAddCart(newItem?.detailId, item?.amount ? item?.amount : 1)
                } catch (e) {
                    console.error("Error in handleAddCart:", e);
                    toast.error("Lỗiiiii")
                }
                if (kq?.data?.status === 200) {
                    setItem({})
                    toast.success("Sản phẩm đã được thêm vào giỏ hàng của bạn!")
                } else {
                    toast.error("Thất bại! Vui lòng thử lại")
                }
            }

        } else {
            toast.error("Vui lòng chọn kích thước phù hợp!")
        }
    }

    useEffect(() => {
    }, []);
    return (
        <>{!load ?
            <div>
                {/* <!-- Open Content --> */}
                <section class="bg-light">
                    <div class="container pb-5">
                        <div class="row">
                            <div class="col-lg-5 mt-5">
                                <div class="card mb-3">
                                    <img class="card-img img-fluid"
                                        src={productDetail?.linkImg} alt="Card image cap"
                                        id="product-detail" />
                                </div>

                            </div>
                            {/* <!-- col end --> */}
                            {<div class="col-lg-7 mt-5">
                                <div class="card">
                                    <div class="card-body">
                                        <h1 class="h2">{productDetail?.name}</h1>
                                        {/* <p class="h3 py-2 price_txt">{product?.price.toLocaleString('vi', {
                                            style: 'currency',
                                            currency: 'VND'
                                        })}</p> */}
                                        {
                                                    promotionValue > 0 ?                                                      
                                                        <td>
                                                            <div className="text-center">
                                                                <div className="text-decoration-line-through text-muted mb-1">
                                                                    {price.toLocaleString('vi', {
                                                                        style: 'currency',
                                                                        currency: 'VND'
                                                                    })}
                                                                </div>
                                                                <div className="text-center mb-0 price_txt">
                                                                    {(price * (100 - promotionValue) / 100).toLocaleString('vi', {
                                                                        style: 'currency',
                                                                        currency: 'VND'
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        :
                                                        <td className="text-center mb-0 price_txt">{price.toLocaleString('vi', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        })}</td>
                                                }

                                        {
                                            productDetail.length !== 0 ?
                                                <Form>
                                                    <input type="hidden" name="product-title" value="Activewear" />
                                                    <div class="row">
                                                        {/* <div className="col-full">
                                                            <strong>Color </strong>
                                                            {<Form onChange={handleChangeColor}>
                                                                {Array.from(colorAvail).map((i) =>
                                                                    <Form.Check
                                                                        inline
                                                                        reverse
                                                                        label={i}
                                                                        name="group1"
                                                                        type="radio"
                                                                        id={i}
                                                                    />
                                                                )}
                                                            </Form>}
                                                        </div> */}

                                                        <div class="col-full">
                                                            <strong>Size</strong>
                                                            <Form onChange={handleChangeSize}>
                                                                {sizeAvail?.map((i) =>
                                                                    <Form.Check
                                                                        inline
                                                                        reverse
                                                                        label={i?.size}
                                                                        name="group_size"
                                                                        type="radio"
                                                                        id={i?.size}
                                                                    />
                                                                )}
                                                            </Form>
                                                        </div>

                                                        <div class="col-full flex align-items-center pb-3">
                                                            <div className="list-inline-item">Số lượng</div>
                                                            <div className="count-input spinner_input">
                                                                <InputSpinner
                                                                    type={'int'}
                                                                    precision={0}
                                                                    max={100}
                                                                    min={1}
                                                                    step={1}
                                                                    value={1}
                                                                    onChange={handleChangeAmount}
                                                                    variant={'info'}
                                                                    size="sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row pb-3">
                                                        <div class="col d-grid">
                                                            <button class="btn btn-success btn-lg" onClick={buyNow}>Mua ngay</button>
                                                        </div>
                                                        <div class="col d-grid">
                                                            <button type="submit" class="btn btn-success btn-lg"
                                                                name="submit" onClick={handleSubmitAdd}>Thêm giỏ hàng
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Form>
                                                :
                                                <div class="col-lg-7 mt-5">
                                                    <div class="card">
                                                        <div class="card-body" style={{ background: " #f8d7da", color: " #721c24" }}>
                                                            <h6>Đã Bán Hết</h6>
                                                        </div>
                                                    </div>
                                                </div>}
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </section>
                {/* <!-- Close Content --> */}
            </div>
            :
            <div className={"center loading"}>
                <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
            </div>
        } </>)
}

export default userLayout(ChoosingPage);