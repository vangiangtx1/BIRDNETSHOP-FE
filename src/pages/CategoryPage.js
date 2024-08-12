import { useEffect, useState } from "react";
import adminLayout from "../admin/adminLayout";
import axiosApiInstance from "../context/interceptor";
import { Button, Form, Modal, Row, Col } from "react-bootstrap"
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import axios from "../api/axios";

const CategoryPage = () => {

    const [load, setLoad] = useState(false);
    const [list, setList] = useState([]);
    const [show, setShow] = useState(false);
    const [form, setForm] = useState();
    const handleClose = () => setShow(false);
    const [category_name, setName] = useState();
    const [id, setID] = useState();
    const [change, setChange] = useState(false);

    async function getCategory() {
        try {
            const result = await axios.get(axiosApiInstance.defaults.baseURL + `/api/category`)
            setLoad(true);
            console.log("result:", result)
            setList(result?.data?.data.items)
        } catch (error) {

        }
    }

    const handleInfo = (e) => {
        setForm("edit")
        setName(e.currentTarget.title)
        setID(e.currentTarget.id)
        setShow(true);
        console.log("id:", e.currentTarget.title)
    }
    const handleShowAdd = (e) => {
        setName(null)
        setID(null)
        setForm("add")
        setShow(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                categoryCode: id,
                categoryName: category_name
            }
            const query = form === "add" ? await axiosApiInstance.post(axiosApiInstance.defaults.baseURL + `/api/category`, payload) :
                await axiosApiInstance.put(axiosApiInstance.defaults.baseURL + `/api/category/update/${id}`, payload)
            if (query?.data?.status === 200)
                toast.success(query?.data.message)
            else
                toast.error(query?.data?.message + "! Vui lòng thử lại")
            setChange(!change)
            setShow(false)
        } catch (error) {

        }
    }

    const handleDelete = async (e) => {
        try {
            const confirm = window.confirm("Ngài có chắc chắn muốn xóa danh mục này? ");
            if (confirm) {
                const query = await axiosApiInstance.delete(axiosApiInstance.defaults.baseURL + `/api/category/delete/${e.currentTarget.id}`)
                if (query?.data?.status === 200)
                    toast.success(query?.data.message)
                else
                    toast.error(query?.data.message + "! Vui lòng thử lại")
                setChange(!change)
            }
        } catch (error) {
            toast.error("Danh mục đã có sản phẩm nên không thể xóa")
        }
    }


    useEffect(() => {
        getCategory();

    }, [change]);
    return (
        <>
            {
                load ?
                    <div className="d-flex justify-content-center">
                        <div className="table-container" style={{ minWidth: '80%' }}>
                            <div className="row">
                                <div className="">
                                    <h5 className="text-uppercase text-center">Danh mục sản phẩm</h5>
                                </div>
                                <div className="col text-right">
                                    <button className="btn btn-default low-height-btn" onClick={handleShowAdd}>
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="d-flex text-muted overflow-auto center">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="col-2">Mã danh mục</th>
                                            <th scope="col" className="col-3">Tên danh mục</th>
                                            <th scope="col" className="col-1">Tác vụ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.map((item) => (
                                            <tr key={item.categoryCode}>
                                                <td>{item.categoryCode}</td>
                                                <td>{item.categoryName}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>
                                                    <button type="button"
                                                        className="btn btn-outline-warning btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                        id={item.categoryCode} title={item.categoryName}
                                                        onClick={handleInfo}>
                                                        <i className="fa fa-pencil" aria-hidden="true"></i>
                                                    </button>

                                                    <button type="button" id={item.categoryCode} title={item.categoryName}
                                                        onClick={handleDelete}
                                                        className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    ><i
                                                        className="fa fa-times"
                                                        aria-hidden="true"></i>
                                                    </button>
                                                </td>
                                            </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{form === "edit" ? "Cập nhật" : "Thêm"} danh mục</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            {form === "add" &&
                                                <Col>
                                                    <Form.Group className="mb-2">
                                                        <Form.Control type="text" placeholder="Nhập mã danh mục" name="id" required
                                                            value={id}
                                                            onChange={(e) => setID(e.target.value)} />
                                                    </Form.Group>
                                                </Col>
                                            }
                                            <Col>
                                                <Form.Group className="mb-2">
                                                    <Form.Control type="text" placeholder="Nhập tên danh mục" name="name" required
                                                        value={category_name}
                                                        onChange={(e) => setName(e.target.value)} />
                                                </Form.Group>
                                            </Col>
                                        </Row>


                                        <Button variant="success" type="submit">
                                            {form === "edit" ? "Cập nhật" : "Thêm"}
                                        </Button>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>

                                </Modal.Footer>
                            </Modal>
                        }
                    </div>
                    :
                    <div className={"center loading"}>
                        <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                    </div>
            }
        </>
    );
}
    ;
export default adminLayout(CategoryPage);