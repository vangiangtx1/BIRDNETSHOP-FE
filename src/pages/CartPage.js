import React, { useEffect, useState } from "react";
import userLayout from "../user/userLayout";
import "./../assets/css/user-view.css";
import InputSpinner from "react-bootstrap-input-spinner";
import { toast } from "react-toastify";
import axiosApiInstance from "../context/interceptor";
import { NavLink, useNavigate } from "react-router-dom";

const CartPage = () => {
    const [myCart, setMyCart] = useState([]);
    const [status, setStatus] = useState(true);
    const [tmp, setTmp] = useState(0);
    const [checkedState, setCheckedState] = useState([]);
    const [total, setTotal] = useState(0);
    const [cart, setCart] = useState([]);

    async function getCart() {
        try {
            const result = await axiosApiInstance.get(
                axiosApiInstance.defaults.baseURL + `/api/cart/all`
            );
            setMyCart(result?.data.data);
            console.log("cart", result?.data?.data);
            setCheckedState(new Array(result?.data.data.length).fill(false));
        } catch (error) {          
        }  
    }

    const handleUpdateCart = async (item, quantity) => {
        try {
            const newQuantity = Math.max(1, quantity); // Đảm bảo quantity không nhỏ hơn 1

        const body = {
            productDetailID: item?.product.id,
            quantity: newQuantity,
        };
        axiosApiInstance({
            method: "post",
            url: axiosApiInstance.defaults.baseURL + `/api/cart/update`,
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("tokens")).data.accessToken
                    }`,
                Accept: "*/*",
                "Content-Type": "application/json",
            },
            data: body,
        });

        // Cập nhật số lượng sản phẩm trong giỏ hàng
        const updatedCart = cart.map((i) =>
            i.product.id === item.product.id && i.size === item.size
                ? { ...i, quantity: newQuantity }
                : i
        );

        console.log("cart test:", updatedCart);
        console.log("item test:", item);
        setCart(updatedCart);
        getTotal();
        } catch (error) {
            
        }
    };

    const handleDeleteItem = async (detailId) => {
        try {
            const result = await axiosApiInstance.delete(
                axiosApiInstance.defaults.baseURL + `/api/cart/delete/${detailId}`
            );
            if (result?.data?.status === 200) {
                toast.success(result?.data?.message);
                setTmp(tmp + 1);
            } else {
                toast.error("Lỗi! Vui lòng thử lại");
            }
        } catch (error) {
            console.error("Error deleting item from cart:", error);
            toast.error("Lỗi! Vui lòng thử lại");
        }
        console.log("ProductDetailID:", detailId);
    };


    const getTotal = (itemChange) => {
        let t = 0;
        cart.forEach((i) => {
            t += (i?.product?.price * (100 - i?.product?.promotionValue) / 100) * i?.quantity
        });
        setTotal(t);
    };

    useEffect(() => {
        getCart();
    }, [tmp]);
    useEffect(() => {
        getCart();
    }, []);
    useEffect(() => {
        getTotal();
    }, [cart]);
    useEffect(() => { }, [myCart]);

    /* tick product to checkout */
    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);
        const addCheckout = updatedCheckedState.reduce((sum, current, index) => {
            if (current === true) {
                sum.push(myCart[index]);
            }
            return sum;
        }, []);
        setCart(addCheckout);
    };

    const navigate = useNavigate();
    const handleOrderClick = () => {
        if (cart.length > 0) {
            navigate('/order', { state: { cart } });
        } else {
            toast.warning('Ngài chưa chọn sản phẩm để thanh toán !!!');
        }
    };


    return (
        <>
            {status ? (
                <div>
                    <div className="container padding-bottom-3x marginTop marginBot">
                        <div className="table-responsive shopping-cart">
                            <h3 className="ms-5 mb-3 mt-1">Giỏ hàng</h3>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Sản phẩm</th>
                                        <th className="text-center">Đơn giá</th>
                                        <th className="text-center">Số Lượng</th>
                                        <th className="text-center">Số tiền</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myCart &&
                                        myCart?.map((item, index) => (
                                            <tr>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        value={item?.product.name}
                                                        onChange={() => handleOnChange(index)}
                                                        checked={checkedState[index]}
                                                    ></input>
                                                </td>
                                                <td>
                                                    <div className="product-item">
                                                        <a className="product-thumb" href="#">
                                                            <img src={item.product?.linkImg} alt="Product" />
                                                        </a>
                                                        <div className="product-info">
                                                            <h4 className="product-title">
                                                                <a href="#">{item?.product.name}</a>
                                                            </h4>
                                                            <span>
                                                                <em>Size:</em> {item?.size}
                                                            </span>
                                                            {/* <span><em>Color:</em> {item.product?.color}</span> */}
                                                        </div>
                                                    </div>
                                                </td>

                                                {
                                                    item?.product?.promotionValue > 0 ?
                                                        <td>
                                                            <div className="text-center">
                                                                <div className="text-decoration-line-through text-muted mb-1">
                                                                    {item?.product?.price.toLocaleString('vi', {
                                                                        style: 'currency',
                                                                        currency: 'VND'
                                                                    })}
                                                                </div>
                                                                <div className="text-center mb-0 price_txt">
                                                                    {(item?.product?.price * (100 - item?.product?.promotionValue) / 100).toLocaleString('vi', {
                                                                        style: 'currency',
                                                                        currency: 'VND'
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        :
                                                        <td className="text-center mb-0 price_txt">{item?.product?.price.toLocaleString('vi', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        })}</td>
                                                }

                                                {/* <td className="text-center text-lg text-medium price_txt">{item?.product.price}</td> */}
                                                <td className="text-center ">
                                                    <div className="count-input spinner_input">
                                                        {/* <InputSpinner
                                                            type={"int"}
                                                            precision={0}
                                                            max={100}
                                                            min={1}
                                                            step={1}
                                                            value={item?.quantity}
                                                            onChange={(e) => handleUpdateCart(item, e)}
                                                            variant={"info"}
                                                            size="sm"
                                                        /> */}
                                                        <InputSpinner
                                                            type={"int"}
                                                            precision={0}
                                                            max={item?.product?.detailInventory.find(d => d.size === item.size)?.inventory || 100}
                                                            min={1}
                                                            step={1}
                                                            value={item.quantity}
                                                            onChange={(value) => handleUpdateCart(item, value)}
                                                            variant={"info"}
                                                            size="sm"
                                                        />

                                                    </div>
                                                </td>
                                                <td className="text-center text-lg text-medium mb-0 price_txt">
                                                    {(item?.product?.price * (100 - item?.product?.promotionValue) / 100 * item?.quantity).toLocaleString("vi", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })}
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        className="remove-from-cart"
                                                        onClick={() => handleDeleteItem(item?.product?.detailInventory?.find(inv => inv.size === item.size).detailId)}
                                                        data-toggle="tooltip"
                                                        title=""
                                                        data-original-title="Remove item"
                                                    >
                                                        <i
                                                            // id={item[index]?.product?.detailInventory[index]?.detailId}
                                                            className="fa fa-trash"
                                                        ></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="shopping-cart-footer">
                            <div className="column text-lg ">
                                <strong>Tổng tiền: </strong>
                                <span className="text-medium mb-0 price_txt">
                                    {total.toLocaleString("vi", {
                                        style: "currency",
                                        currency: "VND",
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="shopping-cart-footer">
                            <div className="column">
                                <a className="btn btn-outline-secondary" href="/shop">
                                    <i className="icon-arrow-left"></i>&nbsp;Back to Shopping
                                </a>
                            </div>
                            <div className="column">
                                <span className="btn btn-success" onClick={handleOrderClick}>
                                    Đặt hàng
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container padding-bottom-3x marginTop marginBot">
                    <h3 className="ms-5 mb-3 mt-1">Giỏ hàng</h3>
                    <p className="ms-3 mt-2">Không có sản phẩm trong giỏ hàng</p>
                    <div className="column ms-3">
                        <a className="btn btn-outline-secondary mt-5" href="/shop">
                            <i className="icon-arrow-left"></i>&nbsp;Back to Shopping
                        </a>
                    </div>
                </div>
            )}
        </>
    );
};

export default userLayout(CartPage);
