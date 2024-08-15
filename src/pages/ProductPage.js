import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ReactLoading from "react-loading";
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import adminLayout from "../admin/adminLayout";
import axiosApiInstance from "../context/interceptor";
import Pagination from "../components/Pagination";
import axios from "../api/axios";


const ProductPage = () => {
    const param = useLocation();
    const query = new URLSearchParams(param.search);
    const page = parseInt(query.get('page') || '1', 10);
    const itemsPerPage = 10;
    const [totalPage, setTotalPage] = useState(1)
    const [change, setChange] = useState(false);


    const [list, setList] = useState([]);
    const [load, setLoad] = useState(false);
    const [quantity, setQuantity] = useState(1)
    const [listCate, setListCate] = useState([]);
    const [listTag, setListTag] = useState([]);
    const [editForm, setEditForm] = useState(false);
    const [modalForm, setModalForm] = useState(false);
    const [productDetail, setProductDetail] = useState([]);
    const [product_id, setId] = useState();
    const [product_name, setName] = useState();
    const [product_image, setImage] = useState();
    const [product_category, setCategory] = useState();
    const [product_sold, setSold] = useState();
    const [product_describe, setDescribe] = useState();
    const [IdCategory, setIdCategory] = useState();


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

    const handleShow = (item) => {
        setModalForm(true);
        setId(item.id)
        setName(item.name)
        setImage(item.linkImg);
        setDescribe(item.description)
        setShow(true);
        setEditForm(true);
    }

    const handleShowInfo = (e) => {
        setModalForm(false);

        setImage(null)
        const tmpID = parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[0].innerText;
        setId(tmpID)
        getDetails(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[0].innerText);
        setName(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[1].innerText)
        setImage(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[2].firstChild.currentSrc)
        setCategory(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[3].innerText)
        setSold(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[4].innerText)
        setDescribe(parents(e.target).find(function (c) {
            return c.tagName === "TR"
        }).children[5].innerText)

        setShow(true);
    }
    const handleShowAdd = (e) => {
        setModalForm(true);
        setShow(true);
        setEditForm(false);
        setId(null);
        setName(null);
        setDescribe(null);
        setCategory(null);
        setSold(null);
        setImage(null);

    }
    const sendNotifyForApp = async (pro) => {
        const paramSend = {
            "data": {
                "productId": pro?.id
            },
            "notification": {
                "body": "Sản phẩm mới đã có tại của hàng",
                "title": "Thông báo",
                "image": pro?.linkImg,
                "badge": "1"
            },
            "to": "/topics/new-product"
        }
        const headers = {
            'Authorization': 'key=AAAAIE6_JeY:APA91bFpnQfZqn-vCdYPdvPDLIAG-KrqQR6U9v1xtzJ3yCrAsnySS6WNvETNBV1eymDQm0m7ouwySiIfIMftHpOMW1mbeAEnpv83FPLvjcXyk_YrdJRONTUsg-y-BKyCN0wImmYsKkG1',
        };
        try {
            const response = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `https://fcm.googleapis.com/fcm/send', paramSend, { headers }`)
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     let tokensData = JSON.parse(localStorage.getItem("tokens"))
    //     const params = {
    //         description: product_describe,
    //         name: product_name,
    //         // price: product_sold,
    //         categories: [
    //             "idCategory"
    //         ]
    //     }
    //     const methodForm = editForm ? 'put' : 'post';
    //     const urlForm = editForm ? `/api/product/update/${product_id}` : `/api/product/add`;
    //     const kq = await axiosApiInstance({
    //         method: methodForm,
    //         url: axiosApiInstance.defaults.baseURL + urlForm,
    //         params: params,
    //         headers: {
    //             'Authorization': `Bearer ${tokensData.data.accessToken}`,
    //             'Accept': '*/*',
    //             'Content-Type': 'multipart/form-data'
    //         },
    //         data: {
    //             image: imageFiles[0]
    //         }
    //     });
    //     console.log("KQ:", kq)
    //     if (kq.data?.status === 200) {
    //         toast.success(kq.data.message);
    //         getProduct(param.search === '' ? '?page=1' : param.search, 5);
    //         setShow(false);
    //         // if (!editForm) {
    //         //     await sendNotifyForApp(kq.data?.product)
    //         // }
    //     } else
    //         toast.error(kq.data.message);
    //     console.log("Product:",params)
    // }
    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'f3hgyej7'); // Thay thế bằng upload preset của bạn

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dd2ozi6iz/image/upload', formData);
            console.log(response)
            return response.data.secure_url; // URL của hình ảnh đã tải lên
        } catch (error) {
            console.error("Error uploading image to Cloudinary", error);
            toast.error("An error occurred while uploading the image.");
            throw error;
        }
    };

    const handleLock = async (item) => {
        try {
            const confirm = window.confirm(
                "Xác nhận khóa sản phẩm ? "
            );
            if (confirm) {
                const re = await axiosApiInstance.post(
                    axiosApiInstance.defaults.baseURL + `/api/product/lock/${item.id}`
                );
                if (re.data.status === 200) {
                    toast.success(re.data.message);
                    setChange(!change);
                    setShow(false);
                }
                if (re.data.status === 405) {
                    toast.warning(re.data.message);
                }
            }
        } catch (error) {
            toast.error(error);
        }
    };

    const handleUnlock = async (item) => {
        try {
            const confirm = window.confirm(
                "Xác nhận mở khóa sản phẩm ? "
            );
            if (confirm) {
                const re = await axiosApiInstance.post(
                    axiosApiInstance.defaults.baseURL + `/api/product/unlock/${item.id}`
                );
                if (re.data.status === 200) {
                    toast.success(re.data.message);
                    setChange(!change);
                    setShow(false);
                }
                if (re.data.status === 405) {
                    toast.warning(re.data.message);
                }
            }
        } catch (error) {
            toast.error(error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        let tokensData = JSON.parse(localStorage.getItem("tokens"));
        const file = imageFiles[0]; // Giả sử bạn có một file hình ảnh trong state hoặc biến

        try {
            // Tải ảnh lên Cloudinary
            const imageUrl = await uploadImageToCloudinary(file);

            // Tạo đối tượng chứa dữ liệu sản phẩm
            const product = {
                name: product_name,
                description: product_describe,
                categories: [IdCategory], // Giả sử bạn có một mảng id category
                imageUrl: imageUrl // Thêm URL hình ảnh vào dữ liệu sản phẩm
            };

            const methodForm = 'post';
            const urlForm = editForm ? `/api/product/update/${product_id}` : `/api/product/add`;

            // Gửi dữ liệu sản phẩm đến backend
            const response = await axios({
                method: methodForm,
                url: urlForm,
                headers: {
                    'Authorization': `Bearer ${tokensData.data.accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(product) // Chuyển đổi đối tượng product thành chuỗi JSON
            });

            if (response.data?.status === 200) {
                setChange(!change)
                toast.success(response.data.message);
                setShow(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error submitting the form", error.response?.data || error);
            toast.error("An error occurred while submitting the form.");
            // console.log("data:", JSON.stringify(product));
        }
    };



    const handleCategoryChange = (e) => {
        setIdCategory(e.target.value);
        // `e.target.value` sẽ chứa id của danh mục
        console.log('Selected category ID:', e.target.value);
    };

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
    }, [page, change]);


    async function getDetails(id) {
        try {
            const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/product/detail/${id}`)
            setLoad(true);
            setProductDetail(result?.data?.data.detailInventory)
            setDescribe(result?.data?.data?.description)
            console.log(result)
        } catch (error) {

        }
    }

    async function getAllTags() {
        // const result = await axios.get(axios.defaults.baseURL + `/api/chatbot/tags/list`)
        setLoad(true);
        // setListTag(result?.data)
    }


    async function getCategory() {
        try {
            const result = await axiosApiInstance.get(axiosApiInstance.defaults.baseURL + `/api/category`)
            // console("result",result)
            setLoad(true);
            setListCate(result?.data.data.items)
        } catch (error) {

        }
    }

    useEffect(() => {
        // getProduct((param.search === '' ? '?page=1' : param.search, 5))
        getCategory();
        getAllTags();
    }, [param]);


    const imageTypeRegex = /image\/(png|jpg|jpeg)/gm;

    const [imageFiles, setImageFiles] = useState([]);
    const [images, setImages] = useState([]);

    const changeHandler = (e) => {
        const { files } = e.target;
        const validImageFiles = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.match(imageTypeRegex)) {
                validImageFiles.push(file);
            }
        }
        if (validImageFiles.length) {
            setImageFiles(validImageFiles);
            return;
        }
        alert("Selected images are not of valid type!");
    };

    useEffect(() => {
        const images = [];
        const fileReaders = [];
        let isCancel = false;

        if (imageFiles.length) {
            imageFiles.forEach((file) => {
                const fileReader = new FileReader();
                fileReaders.push(fileReader);
                fileReader.onload = (e) => {
                    const { result } = e.target;
                    if (result) {
                        images.push(result);
                    }
                    // Kiểm tra nếu đã đọc tất cả file và không bị hủy
                    if (images.length === imageFiles.length && !isCancel) {
                        setImages(images);
                    }
                };
                fileReader.readAsDataURL(file);
            });
        }

        return () => {
            isCancel = true;
            fileReaders.forEach((fileReader) => {
                if (fileReader.readyState === 1) {
                    fileReader.abort();
                }
            });
        };
    }, [imageFiles]);

    return (
        <>{
            load ?
                <div>
                    <div className="table-container" style={{ width: '100%' }}>
                        <div className="row">
                            <div className="">
                                <h5 className="text-uppercase text-center">Danh sách sản phẩm</h5>
                            </div>
                            <div className="col text-right">
                                <button className="btn btn-default low-height-btn" onClick={handleShowAdd}>
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <div className="d-flex text-muted overflow-auto">
                            <table className="table table-image">
                                <thead>
                                    <tr>
                                        <th scope="col" className="col-2">Mã sản phẩm</th>
                                        <th scope="col" className="col-3">Tên sản phẩm</th>
                                        <th scope="col" className="col-2">Hình ảnh</th>
                                        <th scope="col" className="col-2">Danh mục</th>
                                        <th scope="col" className="col-2">Giá bán</th>
                                        <th scope="col" className="col-1">Mô tả</th>
                                        <th scope="col" className="col-2">Tác vụ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((item) => (
                                        <tr key={item.id}>
                                            <th scope="row">{item.id}</th>
                                            <td className="tdName">{item.name}</td>
                                            <td className="tdImage w-25">
                                                <img
                                                    src={item.linkImg}
                                                    width="50" height="50" className="img-fluid img-thumbnail"
                                                    alt="Sheep" />
                                            </td>
                                            <td className="">{item?.categoryName}</td>
                                            <td className="tdPrice">{item?.price?.toLocaleString('vi', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}</td>
                                            <td className="tdDescribe">{item.description}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <button type="button"
                                                    className="btn btn-outline-primary btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Chi tiết" onClick={handleShowInfo}><i className="fa fa-info"
                                                        aria-hidden="true"></i>
                                                </button>
                                                <button type="button"
                                                    className="btn btn-outline-warning btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    title="Chỉnh sửa" onClick={() => handleShow(item)}><i className="fa fa-pencil"
                                                        aria-hidden="true"></i>
                                                </button>
                                                {item?.isDeleted == false ?
                                                    <button type="button" id={item.categoryCode} title={item.categoryName}
                                                        onClick={() => handleLock(item)}
                                                        className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    ><i className="fa fa-unlock" aria-hidden="true"></i>
                                                    </button> :
                                                    <button type="button" id={item.categoryCode} title={item.categoryName}
                                                        onClick={() => handleUnlock(item)}
                                                        className="btn btn-outline-danger btn-light btn-sm mx-sm-1 px-lg-2 w-32"
                                                    ><i className="fa fa-lock" aria-hidden="true"></i>
                                                    </button>
                                                }


                                            </td>
                                        </tr>))}

                                </tbody>
                            </table>
                        </div>
                        <Pagination refix='product' size={totalPage} />
                    </div>


                    {modalForm ?
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Quản lý sản phẩm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form onSubmit={handleSubmit}>

                                    <Form.Group className="mb-2">
                                        <Form.Control type="text" placeholder="Tên sản phẩm" name="name" required
                                            value={product_name} onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Control
                                            as="select"
                                            name="category"
                                            required
                                            value={product_category}
                                            onChange={handleCategoryChange}
                                            id="select">
                                            <option value="">Danh mục</option>
                                            {listCate.map((cate) => (
                                                <option value={cate.categoryCode} key={cate.categoryCode}>{cate.categoryName}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        {product_image ? (<ul className="list-images">
                                            <li><img src={product_image} /></li>
                                        </ul>) : null}
                                        {/* {images.length > 0 ?
                                            <ul className="list-images">
                                                {
                                                    images.map((image, index) => {
                                                        return <li key={index}><img src={image} /></li>
                                                    })
                                                }
                                            </ul> : null
                                        } */}
                                        <Form.Control type="file" id="file" onChange={changeHandler}
                                            accept="image/png, image/jpg, image/jpeg" multiple />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Control type="text" placeholder="Mô tả" name="describe" required
                                            value={product_describe}
                                            onChange={(e) => setDescribe(e.target.value)} />
                                    </Form.Group>

                                    {/* <Form.Group className="mb-2">
                                        <Form.Control type="number" placeholder="Giá " name="price" value={product_sold}
                                            onChange={(e) => setSold(e.target.value)} />
                                    </Form.Group> */}

                                    <Button variant="success" type="submit">
                                        {editForm ? "Chỉnh sửa" : "Tạo sản phẩm"}
                                    </Button>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Đóng
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        :
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Chi tiết sản phẩm</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>Tên Sản phẩm : <strong>{product_name}</strong></div>
                                <div>Mô tả: <strong>{product_describe}</strong></div>
                                <table className="table mt-3">
                                    <thead>
                                        <tr bgcolor="Silver">
                                            <th scope="col" className="col-2">Size</th>
                                            <th scope="col" className="col-2">Số lượng</th>
                                        </tr>
                                    </thead>
                                    {productDetail.map(item =>
                                        <tbody>
                                            <tr>
                                                <td>{item.size}</td>
                                                <td className="px-4">{item.inventory}</td>
                                            </tr>
                                        </tbody>
                                    )}

                                </table>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Đóng
                                </Button>
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

};
export default adminLayout(ProductPage);