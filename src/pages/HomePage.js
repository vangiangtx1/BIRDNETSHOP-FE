import React, { useEffect, useState } from "react";
import userLayout from "../user/userLayout"
import "./../assets/css/user-view.css";
import axiosApiInstance from "../context/interceptor";
import { Form, Modal } from "react-bootstrap"
import InputSpinner from "react-bootstrap-input-spinner";
import axios from "../api/axios";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import banner1 from "../assets/images/banner1.jpg"
import banner2 from "../assets/images/banner2.png"

const HomePage = () => {
    const navigate = useNavigate()
    const [list, setList] = useState([]);
    const [load, setLoad] = useState(true);
    const [loadSize, setLoadSize] = useState(false);
    const [status, setStatus] = useState(0);
    const [listCate, setListCate] = useState([]);
    const [loadBestSell, setLoadBestSell] = useState(true);
    const [listBestSeller, setBestSeller] = useState([]);
    const [productDetail, setProductSelected] = useState([]);
    const [imgSelect, setImgSelect] = useState();
    const [sizeAvail, setSizeAvail] = useState();
    const [item, setItem] = useState({});
    const [show, setShow] = useState(false);
    const [order, setOrder] = useState([])


    const handleAddCart = async (id, amount) => {
        try {
            const body = {
                "productID": id,
                "amount": amount
            }
            const result = await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + `/api/cart/AddToCart`, body);
            return result
        } catch (error) {

        }
    }

    async function getProduct() {
        try {
            const result = await axios.get(axiosApiInstance.defaults.baseURL + `/api/product`);
            setLoad(false);
            setList(result?.data.data.items)
        } catch (error) {

        }
    }

    async function getBestSeller() {
        try {
            const result = await axios.get(axiosApiInstance.defaults.baseURL + `/api/product/best-selling`);
            setLoadBestSell(false);
            setBestSeller(result?.data.data)
        } catch (error) {

        }

    }

    async function getCategory() {
        try {
            const result = await axios.get(axios.defaults.baseURL + `/api/category`)
            console.log("List category:", result)
            setListCate(result?.data?.data.items)
        } catch (error) {

        }
    }

    async function getDetails(id) {
        try {
            const result = await axios.get(axios.defaults.baseURL + `/api/product/detail/${id}`)
            console.log("KQ :", result)
            setStatus(1)
            setLoad(true);
            setLoadSize(true)
            setProductSelected(result?.data.data)
            setSizeAvail(result?.data?.data.detailInventory)
            console.log("KQ:", result?.data?.data.detailInventory)
        } catch (error) {

        }
    }

    const handleClose = () => {
        setShow(false);
        setImgSelect(null);
        setStatus(0)
        setItem({})
    }

    const handleShow = (e) => {
        e.preventDefault();
        setImgSelect(e.target.title)
        setShow(true);
        getDetails(e.target.id)
    }


    const handleChangeColor = (e) => {
        item.color = e.target.id
        setItem(item)
        setSizeAvail(productDetail.filter(i => i.color === e.target.id))
        setLoadSize(true)
    }
    const handleChangeSize = (e) => {
        item.size = e.target.id
        setItem(item)
    }
    const handleChangeAmount = (e) => {
        item.sl = e
        setItem(item)
    }

    const buyNow = (e) => {
        try {
            const tmp = {};
            if (item.color && item.size) {
                const newItem = productDetail.find(i => i?.color === item.color && i?.size == item.size)
                if (newItem) {
                    if (newItem?.current_number < item?.sl || newItem?.current_number < 1)
                        toast.error("Sản phẩm không đủ số lượng bạn cần! \n Vui lòng giảm số lượng!")
                    else {
                        tmp.amount = item.sl ? item.sl : 1
                        tmp.product = productDetail.find(i => i.color === item.color && i.size === item.size)
                        order.push(tmp)
                        setOrder(order)
                        navigate('/theorder', { state: order });
                    }
                }
            } else
                toast.error("Vui lòng chọn đủ thông tin")

            e.preventDefault()
        } catch (error) {

        }
    }

    const handleSubmitAdd = async (e) => {
        e.preventDefault()
        const newItem = productDetail.find(i => i?.color === item.color && i?.size == item.size)
        if (newItem) {
            if (newItem?.current_number < item?.sl || newItem?.current_number < 1)
                toast.error("Sản phẩm không đủ số lượng bạn cần! \n Vui lòng giảm số lượng!")
            else {
                let kq = null;
                try {
                    kq = await handleAddCart(newItem?.id, item.sl ? item?.sl : 1)
                } catch (e) {

                }
                if (kq?.data?.status === 200) {
                    setItem({})
                    setShow(false)
                    toast.success("Sản phẩm đã được thêm vao giỏ hàng của bạn!", { position: "top-center" })
                } else {
                    toast.error("Thất bại! Vui lòng thử lại")
                }
            }

        } else {
            toast.error("Vui lòng chọn màu và kích thước phù hợp!")
        }
    }

    useEffect(() => {
        getBestSeller();
        getProduct();
        getCategory();

    }, []);


    return <>
        {/* <!-- Start Banner Hero --> */}
        <div id="template-mo-zay-hero-carousel" class="carousel slide" data-bs-ride="carousel">
            <ol class="carousel-indicators d-none">
                <li data-bs-target="#template-mo-zay-hero-carousel" data-bs-slide-to="0" class="active"></li>
                <li data-bs-target="#template-mo-zay-hero-carousel" data-bs-slide-to="1"></li>
            </ol>
            <div class="carousel-inner info-shop">
                <div class="carousel-item active">
                    <div class="container banner">
                        <div class="row">
                            <img
                                src={banner1}
                                alt="" />
                        </div>
                    </div>
                </div>
                <div class="carousel-item ">
                    <div class="container banner">
                        <div class="row">
                            <img
                                src={banner2}
                                alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <a class="carousel-control-prev text-decoration-none w-auto ps-3"
                href="#template-mo-zay-hero-carousel"
                role="button" data-bs-slide="prev">
                <i class="fa fa-chevron-left"></i>
            </a>
            <a class="carousel-control-next text-decoration-none w-auto pe-3"
                href="#template-mo-zay-hero-carousel"
                role="button" data-bs-slide="next">
                <i class="fa fa-chevron-right"></i>
            </a>
        </div>
        {/* <!-- End Banner Hero --> */}

        {/*Start Chinh sach*/}
        <section class="container ">
            <div class="row text-center pt-3 ">
                <div class="col-md-3 info">
                    <h2 class="home-icon">
                        <i class="fa fa-truck"></i>
                    </h2>
                    <h3 class="h6 text-decoration-none">
                        GIAO HÀNG TOÀN QUỐC
                    </h3>
                    <p class="content">Thời gian giao hàng linh động từ 3 - 4 - 5 ngày tùy khu vực, đôi khi sẽ
                        nhanh hơn
                        hoặc chậm hơn. Mong Quý Khách hàng thông cảm.</p>
                </div>

                <div class="col-md-3 info">
                    <h2 class="home-icon">
                        <i class="fa fa-refresh"></i>
                    </h2>
                    <h3 class="h6 text-decoration-none">
                        CHÍNH SÁCH ĐỔI TRẢ HÀNG
                    </h3>
                    <p class="content">Sản phẩm được phép đổi hàng trong vòng 36h nếu phát sinh lỗi từ nhà sản
                        xuất &#40;Yêu cầu: hình ảnh phần bị lỗi rõ nét, chi tiết và đầy đủ&#41;.</p>
                </div>

                <div class="col-md-3 info">
                    <h2 class="home-icon">
                        <i class="fa fa-truck"></i>
                    </h2>
                    <h3 class="h6 text-decoration-none">
                        GIAO HÀNG NHẬN TIỀN VÀ KIỂM KÊ ĐƠN HÀNG
                    </h3>
                    <p class="content">Được phép kiểm hàng trước khi thanh toán.</p>
                </div>

                <div class="col-md-3 info">
                    <h2 class="home-icon">
                        <i class="fa fa-phone"></i>
                    </h2>
                    <h3 class="h6 text-decoration-none">
                        ĐẶT HÀNG ONLINE VÀ KIỂM TRA ĐƠN HÀNG VUI LÒNG LIÊN HỆ
                    </h3>
                    <p style={{ marginLeft: "23px" }} class="content">Hotline: 012 345 6789.</p>
                </div>

            </div>
        </section>
        {/*<!--End Chính sách--> */}

        {/**<!--Start favorite category--> */}
        {/* <section>
            <div class="container py-5">
                <div class="row text-center py-3">
                    <div class="col-lg-6 m-auto">
                        <h1 class="h1 py-1">DANH MỤC</h1>
                        <p>Danh mục sản phẩm của cửa hàng. </p>
                    </div>
                </div>
                <div class="row">
                {listCate && listCate.map((item, index) => (
                    <div className="col-md-3 py-2" key={index}>
                        <div className="card rounded-0">
                             <a href={`shop/${item?.categoryName}`}>
                             <img 
                                className="card-img rounded-0 img-fluid type-img" 
                                 src={item?.pictures} 
                                 alt={item?.categoryName} 
                             />
                            </a>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </section> */}

        {/* <!-- Start Best Seller Product --> */}
        <section>
            <div class="container py-5">
                <div class="row text-center py-3">
                    <div class="col-lg-6 m-auto">
                        <h1 class="h1 py-1">Bán chạy</h1>
                        <p>Top sản phẩm bán chạy nhất</p>
                    </div>
                </div>
                <div className="row">
                    {loadBestSell ?
                        <div className={"center loading"}>
                            <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                        </div> :
                        listBestSeller.map((item) => (
                            <div className="col-md-3">
                                <div className="card mb-3 product-wap rounded-0">
                                    <div className="card rounded-0">
                                        <img className="img-config card-img rounded-0 img-fluid"
                                            src={item.linkImg} />
                                        <div
                                            className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                            <button type="button" className="btn btn-success text-white"
                                                title={item.linkImg} id={item?.id}
                                                onClick={handleShow}>
                                                XEM NGAY!
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="">
                                            <a href={`/product/${item?.id}`}
                                                className="h3 text-decoration-none text-config"
                                                title={item.name}>{item.name}</a>
                                        </div>

                                        <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">
                                            <li>M/L/X/XL</li>
                                            <li className="pt-2">
                                                <span
                                                    className="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                                <span
                                                    className="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                                <span
                                                    className="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                                <span
                                                    className="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                                <span
                                                    className="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                            </li>
                                        </ul>
                                        <ul className="list-unstyled d-flex justify-content-center mb-1">
                                            <li>
                                                <i className="text-warning fa fa-star"></i>
                                                <i className="text-warning fa fa-star"></i>
                                                <i className="text-warning fa fa-star"></i>
                                                <i className="text-muted fa fa-star"></i>
                                                <i className="text-muted fa fa-star"></i>
                                            </li>
                                        </ul>
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
                                                <p className="text-center mb-0 price_txt">{item.price.toLocaleString('vi', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                })}</p>
                                        }
                                        {/* <p className="text-center mb-0 price_txt">{item.price}</p> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div className="container py-5">
                <div className="row text-center py-3">
                    <div className="col-lg-6 m-auto">
                        <h1 className="h1 py-1">Sản Phẩm</h1>
                        <p>Tất cả sản phẩm của cửa hàng</p>
                    </div>
                </div>
                <div className="row">
                    {load ?
                        <div className={"center loading"}>
                            <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                        </div>
                        : list.map((item) => (
                            <div className="col-md-3">
                                <div className="card mb-3 product-wap rounded-0">
                                    <div className="card rounded-0">
                                        <img className="img-config card-img rounded-0 img-fluid"
                                            src={item.linkImg} />
                                        <div
                                            className="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                            <button type="button" className="btn btn-success text-white"
                                                title={item.linkImg} id={item?.id}
                                                onClick={handleShow}>
                                                XEM NGAY!
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="">
                                            <a href={`/product/${item?.id}`}
                                                className="h3 text-decoration-none text-config"
                                                title={item.name}>{item.name}</a>
                                        </div>

                                        <ul className="w-100 list-unstyled d-flex justify-content-between mb-0">
                                            <li>M/L/X/XL</li>
                                            <li className="pt-2">
                                                <span
                                                    className="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                                <span
                                                    className="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                                <span
                                                    className="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                                <span
                                                    className="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                                <span
                                                    className="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                            </li>
                                        </ul>
                                        <ul className="list-unstyled d-flex justify-content-center mb-1">
                                            <li>
                                                <i className="text-warning fa fa-star"></i>
                                                <i className="text-warning fa fa-star"></i>
                                                <i className="text-warning fa fa-star"></i>
                                                <i className="text-muted fa fa-star"></i>
                                                <i className="text-muted fa fa-star"></i>
                                            </li>
                                        </ul>
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
                                                <p className="text-center mb-0 price_txt">{item.price.toLocaleString('vi', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                })}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    <div className="col-md-12 d-flex justify-content-center">
                        <Link to="/shop">
                            <button type="button" className="btn btn-outline-primary">Xem tất cả</button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
        {/* <!-- End Best Seller Product --> */}

        {/*<!--Start modal -->*/}
        <Modal show={show} onHide={handleClose} size={status ? "lg" : "sm"} centered>
            {status ?
                <Modal.Body>
                    <div className="container pb-5">
                        <div className="row">
                            <div className="col-lg-5 mt-5">
                                <div className="card mb-3">
                                    <img className="card-img img-fluid"
                                        src={imgSelect}
                                        alt="Card image cap"
                                        id="product-detail" />
                                </div>

                            </div>
                            {/* <!-- col end --> */}
                            {<div className="col-lg-7 mt-5">
                                <div className="card">
                                    <div className="card-body">
                                        <h1 className="h2">{productDetail?.name}</h1>
                                        <p className="h3 py-2 price_txt">{productDetail?.infoProduct?.price.toLocaleString('vi', {

                                            style: 'currency',
                                            currency: 'VND'
                                        })}</p>
                                        {/* <p className="h3 py-2 price_txt">{productDetail?.infoProduct?.price}</p> */}
                                        {/* <ul className="list-inline">
                                                    <li className="list-inline-item">
                                                        <h6>Avaliable Color :</h6>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <p className="text-muted"><strong>White / Black</strong></p>
                                                    </li>
                                                </ul> */}

                                        {<Form>
                                            <input type="hidden" name="product-title" value="Activewear" />
                                            <div className="row">
                                                {/* <div className="col-full">
                                                            <strong>Màu sắc </strong>
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

                                                <div className="col-full">
                                                    <strong>Size</strong>
                                                    {loadSize ? <Form onChange={handleChangeSize}>
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
                                                        : null}
                                                    {/* {loadSize ? <div>
                                                                    <strong>Có Size</strong>
                                                            </div>: <strong>Không Có Size</strong>} */}
                                                </div>

                                                <div className="col-full flex align-items-center pb-3">
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
                                            <div className="row pb-3">
                                                <div className="col d-grid">
                                                    <button className="btn btn-success btn-lg"
                                                        onClick={buyNow} value="buy">Mua ngay
                                                    </button>
                                                </div>
                                                <div className="col d-grid">
                                                    <button type="submit" className="btn btn-success btn-lg"
                                                        name="submit" onClick={handleSubmitAdd}>
                                                        Giỏ hàng
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>}

                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </Modal.Body>
                :
                <Modal.Body>
                    <div className="container pb-5">
                        <img className="card-img img-fluid" src={imgSelect} width="400" alt="Card image cap"
                            id="product-detail" />
                    </div>
                </Modal.Body>
            }
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
        {/*<!--End modal-->*/}


    </>

}

export default userLayout(HomePage);