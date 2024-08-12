import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import adminLayout from "../admin/adminLayout";

import "../assets/css/customer.css";

import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import Pagination from "../components/Pagination";

const CustomerPage = () => {
    const param = useLocation();

    const [list, setList] = useState([]);
    const [load, setLoad] = useState(false);
    const [totalPage, setTotalPage] = useState(1)

    const [show, setShow] = useState(false);
    async function getProduct() {
        try {
            const result = await axios.get(axios.defaults.baseURL + `/api/user/all`)
            console.log(result.data);
            setLoad(true);
            setList(result?.data.data)
            setTotalPage(result?.data.totalPages)
        } catch (error) {

        }
    }

    useEffect(() => {
        getProduct()

        console.log(list)

    }, [param]);


    return (
        <>{
            load ?
                <div>
                    <div className="table-container" style={{ width: '100%' }}>
                        <div className="mb-4" >
                            <h5 className="text-uppercase text-center">Danh sách khách hàng</h5>
                        </div>
                        <div className="d-flex text-muted overflow-auto">
                            <table className="table ">
                                <thead>
                                    <tr>
                                        <th scope="col" className="col-2">Tên khách hàng</th>
                                        <th scope="col" className="col-1">Giới tính </th>
                                        <th scope="col" className="col-2">SDT</th>
                                        <th scope="col" className="col-2">Địa chỉ</th>
                                        <th scope="col" className="col-2">Email</th>
                                        {/* <th scope="col" className="col-2">Tài khoản</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((item) => (
                                        <tr key={item.id}>
                                            <td className="tdName">{(item?.firstName && item?.firstName) + " " + (item?.lastName && item?.lastName)}</td>
                                            <td className="tdImage">{item?.gender}</td>
                                            <td className="tdCategory">{item?.phone}</td>
                                            <td className="tdCategory">{item?.address}</td>
                                            <td className="tdCategory">{item?.email}</td>
                                            {/* <td className="tdCategory">{item.username}</td> */}

                                        </tr>))}

                                </tbody>
                            </table>
                        </div>
                        <Pagination refix='customer' size={totalPage} />
                    </div>
                </div>
                :
                <div className={"center loading"}>
                    <ReactLoading type={'cylon'} color='#fffff' height={'33px'} width={'9%'} />
                </div>
        }
        </>
    );

};
export default adminLayout(CustomerPage);