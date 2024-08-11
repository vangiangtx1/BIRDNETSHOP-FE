import React, { useEffect, useState } from "react";
import "./../assets/css/order.css";
// import "./../assets/css/user-view.css";
import userLayout from "../user/userLayout";
//import axiosApiInstance from "../context/interceptor";
//import axios from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApiInstance from "../context/interceptor";
import { toast } from "react-toastify";

const TheOrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart } = location.state || []; // Lấy trạng thái được truyền qua NavLink
    console.log("cart",cart)
    const [load, setLoad] = useState(true);
    const [profile, setProfile] = useState({});
    const [tmpMoney, setMoney] = useState(0);
    const [nameReceiver, setName] = useState();
    const [phoneReceiver, setPhone] = useState();
    const [address, setAddressShow] = useState();
    const [payment, setPayment] = useState(1);

    let feeShip = 30000;

    useEffect(() => {
        let t = 0;
        cart&& cart?.forEach((i) => {
            t += (i?.product?.price * (100 - i?.product?.promotionValue) / 100) * i?.quantity
        });
        setMoney(t);
    }, []);

    const [order, setOrder] = useState({});
    const checkPayCOD = (e) => {
        setPayment(2);
    };
    const checkPayVNPay = (e) => {
        setPayment(1);
    };
    async function getProfile() {
        try {
            const result = await axiosApiInstance.get(
                axiosApiInstance.defaults.baseURL + `/api/user/profile`
            );
            console.log("user:", result);
            setLoad(true);
            const data = result?.data?.data.data;
            setProfile(data);
    
            setName(
                (data?.firstName ? data.firstName : "") +
                " " +
                (data?.lastName ? data.lastName : "")
            );
            setPhone(data?.phone);
    
            order.address = data?.address;
            setAddressShow(data?.address);
            setOrder(order);
        } catch (error) {
            
        }
    }

    const handleInfor = () => {
        setAddressShow(order?.address);
        setLoad(false);
    };
    const changeName = (e) => {
        setName(e.target.value);
    };

    const changePhone = (e) => {
        setPhone(e.target.value);
    };

    const changeAddress = (e) => {
        setAddressShow(e.target.value);
    };

    const handleConfirmOrder = async () => {      
        try {
            const productOrder = [];
            cart.forEach((i) => {
                productOrder.push({ productDetailId: i?.product?.detailInventory?.find(inv => inv.size === i.size).detailId, quantity: i.quantity, price: (i?.product?.price * (100 - i?.product?.promotionValue) / 100)});
            });
            const payload = {
                nameReceiver: nameReceiver,
                addressReceiver: address,
                phoneReceiver: phoneReceiver,
                note: "nhanh",
                orderItems: productOrder,
            };
    
            if (
                payload.addressReceiver &&
                payload.phoneReceiver &&
                payload.nameReceiver &&
                payload.note
            ) {
                const result = await axiosApiInstance.post(
                    axiosApiInstance.defaults.baseURL + `/api/order`,
                    payload
                );
                if (result?.data.status == 200) {
                    toast.success(result?.data?.message);
                    setTimeout(() => {
                        navigate('/');
                      }, 2000);
                } else {
                    toast.success("Vui lòng kiểm tra thông tin! " + result?.data.message);
                }
            } else {
                console.log("product order:", payload);
                toast.error("Vui lòng nhập đầy đủ thông tin!");
            }
        } catch (error) {
            
        }
    };
    useEffect(async () => {
        await getProfile();
    }, []);

    return (
        <>
            {location ? (
                <div className="margin-left-right padding-bottom-3x marginTop marginBot row">
                    <div className="table-responsive block-left  ms-2 ">
                        <h5 className="ms-4 mb-3 mt-3">Thông tin khách hàng</h5>
                        {load ? (
                            <div>
                                <div className="form-wrapper">
                                    <div className="borderForm">
                                        <div className="field field_v1 ms-4">
                                            <label for="first-name" className="ha-screen-reader">
                                                Họ tên
                                            </label>
                                            <input
                                                id="nameReceiver"
                                                defaultValue={nameReceiver}
                                                onChange={changeName}
                                                className="field__input"
                                                placeholder=" "
                                                disabled
                                            ></input>
                                            <span className="field__label-wrap" aria-hidden="true">
                                                <span className="field__label">Họ tên</span>
                                            </span>
                                        </div>
                                        <div className="field field_v1 ms-4">
                                            <label for="first-name" className="ha-screen-reader">
                                                Số điện thoại
                                            </label>
                                            <input
                                                id="phoneReceiver"
                                                defaultValue={phoneReceiver}
                                                disabled
                                                className="field__input"
                                                onChange={changePhone}
                                                placeholder=" "
                                            ></input>
                                            <span className="field__label-wrap" aria-hidden="true">
                                                <span className="field__label">Số điện thoại</span>
                                            </span>
                                        </div>
                                        <div className="field field_v1 ms-4 mb-2">
                                            <label htmlFor="first-name" className="ha-screen-reader">
                                                Địa chỉ
                                            </label>
                                            <input
                                                id="address"
                                                className="field__input"
                                                disabled
                                                defaultValue={address}
                                                onChange={changeAddress}
                                                placeholder=" "
                                            ></input>
                                            <span className="field__label-wrap" aria-hidden="true">
                                                <span className="field__label">Địa chỉ</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* <a className="changePass ms-5 mt-5" onClick={handleInfor}> Đổi thông tin</a> */}
                            </div>
                        ) : null}

                        <h5 className="ms-4 mb-3 mt-2">Phương thức vận chuyển</h5>
                        <div className="radio-wrapper">
                            <label className="radio-lable borderForm">
                                <div className="radio-input">
                                    <input
                                        type="radio"
                                        checked="true"
                                        className="me-2 mt-1 ms-5 "
                                    ></input>
                                </div>

                                <span className="radio-input font">
                                    <img
                                        className="method-icon"
                                        width="50"
                                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHTK-Green.png"
                                        alt="GHTK"
                                    />
                                    Sử dụng dịch vụ giao hàng trung gian (GHTK)
                                </span>
                            </label>
                        </div>
                        <h5 className="ms-4 mb-2 mt-3">Phương thức thanh toán</h5>

                        <div className=" field field_v1 ms-4 mb-5 borderForm">
                            <div tabindex="0" className="me-2 mt-2 ms-4">
                                <button
                                    className={payment == 1 ? "btn select-pay" : "btn pay"}
                                    label="VNpay"
                                    onClick={checkPayVNPay}
                                >
                                    <img
                                        className="method-icon"
                                        width="32"
                                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                                        alt="VNPay"
                                    />
                                    Ví VNPay
                                </button>
                            </div>
                            <div tabindex="0" className="me-2 mt-2 mb-2 ms-4">
                                <button
                                    className={payment == 2 ? "btn select-pay" : "btn pay"}
                                    label="TM"
                                    onClick={checkPayCOD}
                                >
                                    Thanh toán khi nhận hàng(COD)
                                </button>
                            </div>
                        </div>
                        <div className="shopping-cart-footer">
                            <div>
                                <a
                                    className="btn btn-outline-secondary mt-2 w-25 mb-2"
                                    href="/cart"
                                >
                                    <i className="icon-arrow-left"></i>&nbsp;Giỏ hàng
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive block-right ">
                        <h5 className="ms-4 mb-3 mt-3">Danh sách sản phẩm</h5>
                        <table className="table">
                            <tbody>
                                {cart&& cart?.map((item, index) => (
                                    <tr>
                                        <td>
                                            <div className=" display-flex">
                                                <a className="" href="#">
                                                    <img
                                                        className="image"
                                                        src={item.product?.linkImg}
                                                        alt="Product"
                                                    />
                                                </a>
                                                <div className="ms-2">
                                                    <p>
                                                        <b className=" fontSize">{item?.product.name}</b>
                                                    </p>
                                                    <p className=" fontSize ">Size: {item?.size}</p>
                                                    {/* <p className=" fontSize ">Color: {item?.product?.color}</p> */}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">x{item?.quantity}</td>
                                        <td className="text-right">
                                            {(item?.product?.price * (100 - item?.product?.promotionValue) / 100).toLocaleString("vi", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                        </td>
                                        {/* <td className="text-right">{item?.product.price}</td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Tạm tính </td>
                                    <td className="textAlign price_txt">
                                        <span>
                                            {tmpMoney.toLocaleString("vi", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Phí vận chuyển</td>
                                    <td className="textAlign price_txt">
                                        <span>
                                            {feeShip.toLocaleString("vi", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>Tổng tiền </td>
                                    <td className="textAlign mb-0 price_txt">
                                        <span>
                                            {(tmpMoney + feeShip).toLocaleString("vi", {
                                                style: "currency",
                                                currency: "VND",
                                            })}
                                        </span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        <div className="shopping-cart-footer">
                            <div className="col-10 mt-3 mb-3 m-auto">
                                <button
                                    className="btn btn-success w-100"
                                    type="submit"
                                    onClick={handleConfirmOrder}
                                >
                                    {" "}
                                    Đặt hàng{" "}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                navigate("/cart")
            )}
        </>
    );
};

export default userLayout(TheOrderPage);
