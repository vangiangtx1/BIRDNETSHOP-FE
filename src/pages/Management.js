import { useEffect, useState } from "react";
import adminLayout from "../admin/adminLayout";
import axiosApiInstance from "../context/interceptor";
import { Button, Modal } from "react-bootstrap"
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import { useLocation } from "react-router-dom";


const Management = () => {

    const param = useLocation();
    const query = new URLSearchParams(param.search);
    const page = parseInt(query.get('page') || '1', 10);
    const itemsPerPage = 10;
    const [totalPage, setTotalPage] = useState(1)
    const [change, setChange] = useState(false);

    const [listOrder, setListOrder] = useState([]);
    const [orderSelected, setOrderSelected] = useState({});
    const [load, setLoad] = useState(false);
    const [loadData, setLoadData] = useState(false);
    const [rand, setRand] = useState(0);

    const status = [
        'Chờ Xác Nhận',
        'Đang Chuẩn Bị Hàng',
        'Đang Vận Chuyển', ,
        'Đã Thanh Toán',
        'Đã Hủy']
    let total = 0;
    let feeShip = 30000;


    function parents(node) {
        let current = node,
            list = [];
        while (current.parentNode != null && current.parentNode != document.documentElement) {
            list.push(current.parentNode);
            current = current.parentNode;
        }
        return list
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    // const handleShow = (e) => {
    //     total = 0;
    //     setShow(true);
    //     const idSelected = Number(parents(e.target).find(function (c) {
    //         return c.tagName == "TR"
    //     }).children[0].innerText);
    // }




    const handleSearch = (e) => {
        setLoadData(false)
        const tmp = {}
        Object.assign(tmp, param);
        if (e.target.id === "submitSearch") {
            const infoSearch = document.getElementById('searchContent').value;
            tmp.info = infoSearch ? infoSearch : '';
        }
        if (e.target.id === "statusChoose")
            tmp.status = e.target.value ? e.target.value : '';
        if (e.target.id === "fromDate")
            tmp.from = e.target.value ? e.target.value : '';
        if (e.target.id === "toDate")
            tmp.to = e.target.value ? e.target.value : '';
        // setParam(tmp);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
    }


    // async function getOrder() {
    //     try {
    //         const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/admin-order`, {params: param});
    //         setListOrder(result?.data?.data?.items);
    //         console.log("list order:",result?.data?.data?.items)
    //         setLoad(true);
    //         setLoadData(true)
    //     } catch (error) {

    //     }
    // }

    useEffect(() => {
        const getOrder= async () => {
            try {
                const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/admin-order`,
                    {
                        params: {
                            page,
                            itemsPerPage
                        }
                    })

                setListOrder(result?.data?.data?.items);
                console.log("list order:", result?.data?.data?.items)
                setLoad(true);
                setLoadData(true)
                setTotalPage(result?.data?.data?.totalPages)
                // console.log("tổng số trang:",result?.data?.data?.totalPages)
            } catch (error) {

            }
        }
        getOrder()
    }, [page,change]);

    async function getOrderDetail(id) {
        try {
            const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/admin-order/${id}`);
            setOrderSelected(result?.data?.data);
            console.log("list order:", result?.data?.data)
            setLoad(true);
            setLoadData(true)
        } catch (error) {

        }
    }

    const handleShow = (orderId) => {
        console.log("id order:", orderId)
        total = 0;
        setShow(true);
        getOrderDetail(orderId);
    }

    const handleConfirm = async (e) => {
        try {
            console.log("id order :", orderSelected.orderId)
            let query = null;
            if (e.target.id === "bt1")
                query = `/api/admin-order/confirm/${orderSelected.orderId}`
            if (e.target.id === "bt2")
                query = `/api/admin-order/delivery/${orderSelected.orderId}`
            if (e.target.id === "bt3")
                query = `/api/admin-order/done/${orderSelected.orderId}`

            const result = await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + query);
            if (result.data.status) {
                toast.success(result.data.message)
                setChange(!change)
                setRand(rand + 1)
                setShow(false)
            } else {
                toast.error(result.data.message)
            }
        } catch (error) {

        }
    };
    const handleCancelOrder = async () => {
        try {
            const confirm = window.confirm("Hủy đơn sẽ ảnh hưởng rất lớn đến khách hàng \n" +
                "Vui lòng hỏi ý kiến của khách hàng trước khi hủy \n " +
                "Xác nhận hủy đơn ? ");
            if (confirm) {
                const result = await axiosApiInstance.delete(axiosApiInstance.defaults.baseURL + `/api/admin/order/cancel_order/${orderSelected.orderId}`);
                if (result.data.status) {
                    toast.success(result.data.message)
                    setRand(rand + 1)
                    setShow(false)
                } else {
                    toast.error(result.data.message)
                }
            }
        } catch (error) {

        }

    };

    // useEffect(() => {
    //     getOrder();

    // }, [param, rand])

    return (
        <>{load ?
            <div>
                <div className="row">
                    <div className="mb-4">
                        <h5 className="text-uppercase text-center">Quản lý đơn hàng</h5>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-md-5">
                        <div className="input-group">
                            <div className="form-outline">
                                <input type="search" className="form-control" id="searchContent"
                                    placeholder="Tìm kiếm..." />
                            </div>
                            <button type="button" id="submitSearch" className="btn btn-primary" onClick={handleSearch}><i className="fa fa-search"></i></button>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3">
                        <select className="form-control" id="statusChoose" onChange={handleSearch}>
                            <option value="">Tất cả</option>
                            {status.map((cate) => (
                                <option value={cate} key={cate}>{cate}</option>
                            ))}

                        </select>
                    </div>
                    <div className="col-lg-4 col-md-4 ms-auto">
                        <div className="d-flex">
                            <label className="p-2">Từ</label> <input className="form-control" id="fromDate" type="date"
                                onChange={handleSearch} />
                            <label className="p-2">Tới</label> <input className="form-control" id="toDate" type="date"
                                onChange={handleSearch} />
                        </div>
                    </div>
                </div>
                <div className="overflow-auto">
                    <table className="table align-items-center mb-0 mt-2">
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Ngày tạo</th>
                                <th>Tên khách hàng</th>
                                <th>Sđt</th>
                                <th>Trạng thái</th>
                                <th className="text-right">Thành tiền</th>
                                <th>Xác nhận</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadData ?
                                listOrder && listOrder?.map(item =>
                                    <tr>
                                        <td>
                                            {item?.orderId}
                                        </td>
                                        <td>
                                            {(item.createdDate).slice(0, 19).replace("T", " ")}
                                        </td>
                                        <td>
                                            {item?.nameReceiver}
                                        </td>
                                        <td>
                                            {item?.phoneReceiver}
                                        </td>
                                        <td>
                                            <span
                                                className={item?.statusName === status.at(0) ? "badge  alert-warning" :
                                                    item?.statusName === status.at(1) ? "badge  alert-success" :
                                                        item?.statusName === status.at(2) ? "badge  alert-secondary" :
                                                            item?.statusName === status.at(3) ? "badge  alert-info" :
                                                                item?.statusName === status.at(4) ? "badge  alert-primary" :
                                                                    "badge alert-danger"}>{item?.statusName}</span>
                                        </td>
                                        {/* <div style={{display: "none"}}>
                                            {total = 0}
                                            {item?.totalMoney.toLocaleString('vi', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}
                                            </div> */}

                                        <td className="text-right">
                                            {(item?.totalMoney + feeShip).toLocaleString('vi', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}
                                        </td>
                                        <div style={{ display: "none" }}>  {total = 0}</div>
                                        <td className="align-middle">
                                            {item?.statusName === status.at(3) || item?.statusName === status.at(4) ?
                                                <button type="button" className="btn btn-outline-secondary btn-sm w-32"
                                                    onClick={() => handleShow(item?.orderId)}>
                                                    <i className="fa fa-info" />
                                                </button> :
                                                <button type="button" onClick={() => handleShow(item?.orderId)}
                                                    className="btn btn-outline-primary btn-sm me-2 w-32">
                                                    <i className="fa fa-pencil" />
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                ) : <div className="ml30 color-dot-light">
                                    Loading..............
                                </div>
                            }

                        </tbody>
                    </table>
                    <Pagination  refix='order' size={totalPage}/>
                </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết đơn hàng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="ctm">
                            {/*<div className="shop_id">Id: {orderSelected?.id}</div>*/}
                            <div className="ctm_name">Họ tên: <div
                                className="pull-right">{orderSelected?.nameReceiver}</div>
                            </div>
                            <div className="ctm_phone">Điện thoại: <div
                                className="pull-right">{orderSelected?.phoneReceiver}</div></div>
                            <div className="ctm_address">Địa chỉ: <div
                                className="pull-right">{orderSelected?.address}</div></div>
                        </div>
                        <div className="detail_order overflow-auto w-100">
                            {orderSelected?.details?.map((item) =>
                                <div className="item_product">
                                    <div className="item_product_left">
                                        {item?.defaultImage ? (
                                            <div className="item_img"><img
                                                src={item?.defaultImage} />
                                            </div>) : null}
                                    </div>
                                    <div className="item_product_right">
                                        <div className="item_name">{item?.productName}</div>
                                        <div className="item_name">Size : {item?.size}</div>
                                        <div className="item_qty me-2">x{item?.quantityOrder}</div>
                                        <div className="item_price me-2">{item?.salePrice.toLocaleString('vi', {
                                            style: 'currency',
                                            currency: 'VND'
                                        })}</div>
                                        <div style={{ display: "none" }}>  {total += item.quantityOrder * item.salePrice}</div>

                                    </div>
                                </div>)}
                        </div>

                        <div className="shipping_price">Phí vận chuyển <div
                            className="pull-right">{feeShip?.toLocaleString('vi', {
                                style: 'currency',
                                currency: 'VND'
                            })}</div></div>
                        <div className="total_price">Tổng Tiền <div
                            className="pull-right">{(feeShip + total)?.toLocaleString('vi', {
                                style: 'currency',
                                currency: 'VND'
                            })}</div></div>
                    </Modal.Body>
                    <Modal.Footer>

                        {orderSelected?.statusName === status.at(0) ?
                            <div>
                                <Button className="me-4" variant="danger" id="btnHuy" onClick={handleCancelOrder}>
                                    Hủy Đơn
                                </Button>
                                <Button variant="success" id="bt1" onClick={handleConfirm}>
                                    Duyệt đơn
                                </Button>
                            </div>
                            : orderSelected?.statusName === status.at(1) ?
                                <Button variant="info" id="bt2" onClick={handleConfirm}>
                                    Giao hàng
                                </Button>
                                : orderSelected?.statusName === status.at(2) ?
                                    <Button variant="primary" id="bt3" onClick={handleConfirm}>
                                        Xác nhận thanh toán
                                    </Button> :
                                    null
                        }


                    </Modal.Footer>
                </Modal>
            </div>
            :
            <div className={"center flex flex-space-around"}>
                <ReactLoading type={'balls'} color='#ccc' height={'100px'} width={'60px'} />
            </div>


        }
        </>
    );

}
    ;
export default adminLayout(Management);