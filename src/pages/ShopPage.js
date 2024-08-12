import React, { useEffect, useState } from "react";
import userLayout from "../user/userLayout"
import "./../assets/css/user-view.css";
import ReactLoading from 'react-loading';
import axiosApiInstance from "../context/interceptor";
import { Form, Modal } from "react-bootstrap"
import InputSpinner from "react-bootstrap-input-spinner";
import { toast } from "react-toastify";
import axios from "../api/axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Pagination from "../components/Pagination";

const ShopPage = () => {
    const param = useLocation();
    const query = new URLSearchParams(param.search);
    const page = parseInt(query.get('page') || '1', 10);
    const itemsPerPage = 10;
    const [totalPage, setTotalPage] = useState(1)

    const navigate = useNavigate()
    // let param = useLocation().pathname.split("/").at(2);
    const { id_category } = useParams();
    const [list, setList] = useState([]);
    const [load, setLoad] = useState(false);
    const [loadSize, setLoadSize] = useState(false);
    const [status, setStatus] = useState(0);
    const [listCate, setListCate] = useState([]);
    const [productDetail, setProductSelected] = useState([]);
    const [imgSelect, setImgSelect] = useState();
    const [sizeAvail, setSizeAvail] = useState([]);
    const [item, setItem] = useState({});
    const [show, setShow] = useState(false);
    const [order, setOrder] = useState([])
    const [price, setPrice] = useState([])

    // const handleAddCart = async (id, amount) => {
    //     const body = {
    //         "productID": id,
    //         "amount": amount
    //     }
    //     const result = await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + `/api/cart/AddToCart`, body);
    //     return result
    // }

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
            setShow(false)
            return result
        } catch (error) {
            
        }
    }

    const handleSearch = async (e) => {

    }
   useEffect(() => {
        const getProduct = async () => {
            try {
                const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/product`,
                    {
                        params: {
                            page,
                            itemsPerPage
                        }
                    })

                setLoad(true);
                console.log("API response:", result?.data?.data);
                setList(result?.data?.data.items)
                setTotalPage(result?.data?.data?.totalPages)
                // console.log("tổng số trang:",result?.data?.data?.totalPages)
            } catch (error) {

            }
        }
        getProduct()
    }, [page]);

    async function getCategory() {
        try {
            const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/category`)
            console.log("result", result?.data.data.items)
            setLoad(true);
            setListCate(result?.data.data.items)
        } catch (error) {
            
        }
    }

    async function getDetails(id) {
        try {
            const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/product/detail/${id}`)
            console.log("KQ :", result)
            setStatus(1)
            setLoad(true);
            setLoadSize(true)
            setProductSelected(result?.data?.data)
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
        setImgSelect(e.target.title)
        setShow(true);
        getDetails(e.target.id)
    }

    // const handleChangeColor = (e) => {
    //     item.color = e.target.id
    //     setItem(item)
    //     setSizeAvail(productDetail.filter(i => i.color === e.target.id))
    //     setLoadSize(true)
    // }

    // const handleChangeSize = (item) => {
    //     item.size = item.size
    //     setItem(item)
    //     console.log("id:",item.size)
    // }
    const handleChangeSize = (e) => {
        item.size = e.target.id
        setItem(item)
        console.log("id:", e.target.id)
    }
    const handleChangeAmount = (e) => {
        item.sl = e
        setItem(item)
        console.log("e:", e)
    }

    // const handleSubmitAdd = async (e) => {
    //     e.preventDefault()
    //     const newItem = productDetail.find(i => i?.color === item.color && i?.size == item.size)
    //     if (newItem) {
    //         if (newItem?.current_number < item?.sl || newItem?.current_number < 1)
    //             toast.error("Sản phẩm không đủ số lượng bạn cần! \n Vui lòng giảm số lượng!")
    //         else {
    //             let kq = null;
    //             try {
    //                 kq = await handleAddCart(newItem?.id, item.sl ? item?.sl : 1)
    //             } catch (e) {

    //             }
    //             if (kq?.data?.status === 200) {
    //                 setItem({})
    //                 setShow(false)
    //                 toast.success("Sản phẩm đã được thêm vao giỏ hàng của bạn!", {position: "top-center"})
    //             } else {
    //                 toast.error("Thất bại! Vui lòng thử lại")
    //             }
    //         }

    //     } else {
    //         toast.error("Vui lòng chọn màu và kích thước phù hợp!")
    //     }
    // }

    const handleSubmitAdd = async (e) => {
        e.preventDefault()
        const newItem = (productDetail?.detailInventory).find(i => i.size === item.size)
        console.log("New Item :", newItem)
        if (newItem) {
            console.log("quantity:", item.sl)
            if (newItem?.inventory < item?.sl || newItem?.inventory < 1)
                toast.error("Sản phẩm không đủ số lượng bạn cần! \n Vui lòng giảm số lượng!")
            else {
                let kq = null;
                try {
                    kq = await handleAddCart(newItem?.detailId, item?.sl ? item?.sl : 1)
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
        } catch (error) {
            
        }

        e.preventDefault()
    }

    useEffect(() => {
        getCategory();
    }, []);

    return (<>
        {load ?
            <div>
                <div className="container py-5">
                    <div className="row">

                        <div className="col-lg-2">
                            <h1 className="h2 pb-4">Danh mục</h1>
                            <ul className="list-unstyled templatemo-accordion">
                                {listCate.map((item) => (
                                    <li className="pb-3">
                                        <a className="collapsed d-flex justify-content-between h3 text-decoration-none"
                                            href={id_category ? `${item.categoryName}` : `shop/${item.categoryName}`}>
                                            {item.categoryName}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-lg-10">
                            <div className="row">
                                {list.map((item) => (
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
                                                        <p className="text-center mb-0 price_txt">{item.price?.toLocaleString('vi', {
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
                            <div div="row">

                            </div>
                            <Pagination  refix='shop' size={totalPage}/>
                        </div>

                    </div>
                </div>
                {/* <!-- End Content --> */}

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
                                                {/* <p className="h3 py-2 price_txt">{productDetail.at(0)?.infoProduct?.price.toLocaleString('vi', {
                                                
                                                    style: 'currency',
                                                    currency: 'VND'
                                                })}</p> */}
                                                <p className="h3 py-2 price_txt">{productDetail?.price?.toLocaleString("vi", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}</p>
                                                {/* <ul className="list-inline">
                                                    <li className="list-inline-item">
                                                        <h6>Avaliable Color :</h6>
                                                    </li>
                                                    <li className="list-inline-item">
                                                        <p className="text-muted"><strong>White / Black</strong></p>
                                                    </li>
                                                </ul> */}

                                                {
                                                    productDetail?.detailInventory?.length !== 0 ?
                                                        <Form>
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
                                                        </Form> :
                                                        <div class="col-lg-7 mt-5">
                                                            <div class="card">
                                                                <div class="card-body" style={{ background: " #f8d7da", color: " #721c24" }}>
                                                                    <h6>Đã Bán Hết</h6>
                                                                </div>
                                                            </div>
                                                        </div>}
                                            </div>
                                        </div>
                                    </div>
                                    }
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
            </div>
            :
            <div className={"center loading"}>
                <ReactLoading type={'bubbles'} color='#fffff' height={'33px'} width={'9%'} />
            </div>
        }
    </>)

}
    ;
export default userLayout(ShopPage);