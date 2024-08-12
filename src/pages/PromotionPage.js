import { useEffect, useState } from "react";
import adminLayout from "../admin/adminLayout";
import axiosApiInstance from "../context/interceptor";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { Button, Form, Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ReactLoading from "react-loading";

const PromotionPage = () => {
    const [load, setLoad] = useState(false);
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [promotion_id, setId] = useState();
    const [promotion_value, setValue] = useState();
    const [promotion_name, setName] = useState();
    const [promotion_description, setDescription] = useState();
    const [promotion_startDate, setstartDate] = useState();
    const [promotion_endDate, setendDate] = useState();
    const [listProductApply, setListProductApply] = useState([]);
    const [listAllProduct, setAllProduct] = useState([]);
    const [listPromotion, setListPromotion] = useState([]);
    const [showDetail, setShowDetail] = useState(false);

    const handleClose = () => {
        setShow(false);
        setShowDetail(false);
    };
    const handleShowAdd = (e) => {
        setShow(true);
    };

    const handleCloseEdit = () => {
        setShowEdit(false);
        setShowDetail(false);
    };
    const handleShowEdit = (item) => {
        setShowEdit(true);
        setDescription(item.description)
        setstartDate(item.startDate)
        setendDate(item.endDate)
        setName(item.name)
        setId(item.id)
        setShowEdit(true);
        // console.log("id:", e.currentTarget.title)
    };

    async function getProduct() {
        try {
            const result = await axiosApiInstance.get(
                axiosApiInstance.defaults.baseURL + `/api/product`
            );
            let listTMP = [];
            result?.data?.data.items.forEach((element) => {
                const { id, name, linkImg } = element;
                listTMP.push({ id, name, linkImg, status: false });
            });
            setAllProduct(listTMP);
            setLoad(true);
        } catch (error) {

        }
    }

    const ClickShowProduct = async (e) => {
        try {
            setShowDetail(true);

            // Lấy ID từ sự kiện
            const tmpID = parents(e.target).find(function (c) {
                return c.tagName === "TR";
            }).children[0].innerText;
            setId(tmpID);

            // Gọi API để lấy dữ liệu sản phẩm áp dụng
            const re = await axiosApiInstance.get('http://localhost:8080/api/product/list-promotion');

            // Kiểm tra cấu trúc dữ liệu trả về
            console.log(re.data.data);

            // Lọc các sản phẩm hợp lệ từ dữ liệu trả về
            const validProducts = re.data.data.filter(item => item.id !== null && item.linkImg !== null && item.price !== null);

            // Cập nhật danh sách sản phẩm áp dụng
            const listNew = listAllProduct.map((item) => {
                // Tìm sản phẩm trong danh sách khuyến mãi
                const promotionProduct = validProducts.find(p => p.id === item.id);

                return {
                    ...item,
                    // Cập nhật giá và trạng thái nếu sản phẩm có trong danh sách khuyến mãi
                    price: promotionProduct ? promotionProduct.price : item.price,
                    status: promotionProduct ? true : false
                };
            });

            setListProductApply(listNew);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Xử lý lỗi nếu cần
        }
    };



    const ClickDeletePromotion = async (e) => {
        try {
            const tmpID = parents(e.target).find(function (c) {
                return c.tagName === "TR";
            }).children[0].innerText;
            const urlForm = `/api/admin/promotion/${tmpID}`;
            const re = await axiosApiInstance.delete(
                axiosApiInstance.defaults.baseURL + urlForm
            );
            if (re.data.status === 200) {
                toast.success("Khuyến mãi đã được xóa");
                await getPromotion();
                setShow(false);
            } else toast.error("Khuyến mãi đã được sử dụng. Không thể xóa");
        } catch (error) {

        }
    };
    async function getPromotion() {
        try {
            const result = await axiosApiInstance.get(
                axiosApiInstance.defaults.baseURL + `/api/promotion`
            );
            setLoad(true);
            setListPromotion(result?.data.data);
            console.log(result.data);
        } catch (error) {

        }
    }
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            let startDate = promotion_startDate + "T00:00:00.740Z";
            let endDate = promotion_endDate + "T23:59:00.740Z";
            //"2023-05-29T09:54:17.740Z"
            const body = {
                promotionName: promotion_name,
                description: promotion_description,
                startDate: startDate,
                endDate: endDate,
                listApply: [
                    {
                        productId: promotion_id,
                        value: promotion_value,
                    },
                ],
            };

            const urlForm = `/api/promotion`;
            const re = await axiosApiInstance.post(
                axiosApiInstance.defaults.baseURL + urlForm,
                body
            );
            if (re.status === 200) {
                toast.success("Thêm khuyến mãi thành công");
                await getPromotion();
                setShow(false);
            } else toast.error("Thêm khuyến mãi không thành công! Thử lại ");
        } catch (error) {

        }
    };

    function parents(node) {
        let current = node,
            list = [];
        while (
            current.parentNode != null &&
            current.parentNode != document.documentElement
        ) {
            list.push(current.parentNode);
            current = current.parentNode;
        }
        return list;
    }
    const handleCheck = (e) => {
        try {
            console.log(e.target.title);
            console.log(promotion_id);
            var body = {
                promotionID: promotion_id,
                listProductID: [e.target.title],
            };
            const re = axiosApiInstance.post("/api/promotion", body);
            console.log(re.data);
            var listNew = [];
            listAllProduct.forEach((item) => {
                if (e.target.title == item.id) {
                    item.status = !item.status;
                }
                listNew.push(item);
            });
            setListProductApply(listNew);
        } catch (error) {
            toast.error("Không thể áp dụng cho sản phẩm này")
        }
    };


    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000); // Chuyển giây thành mili giây
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };


    useEffect(() => {
        getPromotion();
        getProduct();
    }, {});
    return (
        <>
            {load ? (
                <div>
                    <div className="table-container" style={{ width: "100%" }}>
                        <div className="row">
                            <div className="mb-2">
                                <h5 className="text-uppercase text-center">Danh sách Khuyến mãi</h5>
                            </div>
                            <div className="col text-right">
                                <button
                                    className="btn btn-default low-height-btn"
                                    onClick={handleShowAdd}
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div className="d-flex text-muted overflow-auto">
                            <table className="table table-image">
                                <thead>
                                    <tr>
                                        <th scope="col" className="col-1">
                                            Mã KM
                                        </th>
                                        <th scope="col" className="col-2">
                                            Tên
                                        </th>
                                        {/* <th scope="col" className="col-2">%KM</th> */}
                                        <th scope="col" className="col-2">
                                            Mô tả
                                        </th>
                                        <th scope="col" className="col-2">
                                            Ngày bắt đầu
                                        </th>
                                        <th scope="col" className="col-2">
                                            Ngày kết thúc
                                        </th>
                                        <th scope="col" className="col-2">
                                            Tác vụ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listPromotion && listPromotion?.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item?.name}</td>
                                            {/* <td>{item?.promotionValue}%</td> */}
                                            <td>{item?.description}</td>
                                            {/* <td>{item?.startDate?.slice(0, 19).replace("T", " ")}</td>
                                            <td>{item?.endDate?.slice(0, 19).replace("T", " ")}</td> */}
                                            <td>{formatTimestamp(item?.startDate)}</td>
                                            <td>{formatTimestamp(item?.endDate)}</td>
                                            <td style={{ whiteSpace: "nowrap" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Chi tiết"
                                                    onClick={ClickShowProduct}
                                                >
                                                    <i className="fa fa-info" aria-hidden="true"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-warning btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Chỉnh sửa"
                                                    onClick={() => handleShowEdit(item)}
                                                >
                                                    <i className="fa fa-pencil" aria-hidden="true"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Delete"
                                                    onClick={ClickDeletePromotion}
                                                >
                                                    <i className="fa fa-lock" aria-hidden="true"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Thêm khuyến mãi</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        as="select"
                                        value={promotion_id}
                                        onChange={(e) => setId(e.target.value)}>
                                        <option>Chọn sản phẩm áp dụng</option>
                                        {listAllProduct &&
                                            listAllProduct.map((item, index) => {
                                                return (
                                                    <>
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    </>
                                                );
                                            })}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Tên Khuyến Mãi"
                                        name="name"
                                        value={promotion_name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="% Khuyến Mãi"
                                        name="value"
                                        value={promotion_value}
                                        onChange={(e) => setValue(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Mô tả"
                                        name="description"
                                        value={promotion_description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={promotion_startDate}
                                        onChange={(e) => setstartDate(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={promotion_endDate}
                                        onChange={(e) => setendDate(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="success" type="submit">
                                    Tạo Khuyến Mãi
                                </Button>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Đóng
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={showEdit} onHide={handleCloseEdit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Chỉnh sửa khuyến mãi</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        as="select"
                                        value={promotion_id}
                                        onChange={(e) => setId(e.target.value)}>
                                        <option>Chọn sản phẩm áp dụng</option>
                                        {listAllProduct &&
                                            listAllProduct.map((item, index) => {
                                                return (
                                                    <>
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    </>
                                                );
                                            })}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Tên Khuyến Mãi"
                                        name="name"
                                        value={promotion_name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="% Khuyến Mãi"
                                        name="value"
                                        value={promotion_value}
                                        onChange={(e) => setValue(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Mô tả"
                                        name="description"
                                        value={promotion_description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2">
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={promotion_startDate}
                                        onChange={(e) => setstartDate(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={promotion_endDate}
                                        onChange={(e) => setendDate(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="success" type="submit">
                                    Cập nhật
                                </Button>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseEdit}>
                                Đóng
                            </Button>
                        </Modal.Footer>
                    </Modal>


                    <Modal show={showDetail} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Danh sách sản phẩm áp dụng</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                {listProductApply.length != 0 ? (
                                    <table className="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="col-2">
                                                    Mã sản phẩm
                                                </th>
                                                <th scope="col" className="col-2">
                                                    Tên Sản Phẩm
                                                </th>
                                                <th scope="col" className="col-2">
                                                    Hình ảnh
                                                </th>
                                                <th scope="col" className="col-2">
                                                    Giá
                                                </th>
                                                <th>Chọn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listProductApply.map((item) => (
                                                <tr>
                                                    <th>{item.id}</th>
                                                    <th>{item.name}</th>
                                                    <td className="tdImage w-25">
                                                        <img
                                                            src={item.linkImg}
                                                            width="50"
                                                            height="50"
                                                            className="img-fluid img-thumbnail"
                                                            alt="Sheep"
                                                        />
                                                    </td>
                                                    {item?.price ?
                                                        <th>{item?.price?.toLocaleString('vi', {

                                                            style: 'currency',
                                                            currency: 'VND'
                                                        })}</th>
                                                        :
                                                        <td>Không áp dụng</td>
                                                    }

                                                    <th>
                                                        <input
                                                            type="checkbox"
                                                            title={item.id}
                                                            onChange={handleCheck}
                                                            checked={item.status}
                                                        ></input>
                                                    </th>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    "Không có sản phẩm nào áp dụng"
                                )}
                                {/* <Button variant="success" type="submit" >
                                    Tạo Khuyến Mãi
                                </Button> */}
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Đóng
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            ) : (
                <div className={"center loading"}>
                    <ReactLoading
                        type={"cylon"}
                        color="#fffff"
                        height={"33px"}
                        width={"9%"}
                    />
                </div>
            )}
        </>
    );
};
export default adminLayout(PromotionPage);
