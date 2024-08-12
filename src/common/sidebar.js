import {useContext, useState, useEffect, useMemo} from "react";
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import axios from '../api/axios';
import {Link} from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import AuthContext from '../context/AuthProvider';
import axiosApiInstance from '../context/interceptor';

const Sidebar = ({isActive}) => {
    const {user, logout} = useContext(AuthContext);
    const [name, setName] = useState([]);

    /*const navigate = useNavigate();
    useEffect(() => {
      if (!user) navigate("/login");
    })*/

    useEffect(() => {
        axiosApiInstance
            .get(axiosApiInstance.defaults.baseURL + "/api/user/profile")
            .then(response => setName(response?.data?.userInfo?.lastName));
    }, []);
    const sidebarItems = useMemo(() => {
        return [
            {
                icon: <i className="fa fa-dashboard me-3"></i>,
                link: "/",
                title: "Trang chủ",
            },
            {
                icon: <i className="fa fa-user-circle me-3"></i>,
                link: "/customer",
                title: "Khách hàng",
            },
            {
                icon: <i className="fa fa-tags me-3"></i>,
                link: "/category",
                title: "Danh mục",
            },
            {
                icon: <i className="fa fa-product-hunt me-3"></i>,
                link: "/product",
                title: "Sản phẩm",
            },
            {
                icon: <i className="fa fa-cart-plus me-3"></i>,
                link: "/order",
                title: "Đơn hàng",
            }, 
            {
                icon: <i className="fa fa-archive me-3" ></i>,
                link: "/import",
                title: "Nhập hàng",
            },
            {
                icon: <i className="fa fa-gift me-3" ></i>,
                link: "/promotion",
                title: "Giảm giá",
            },
            {
                icon: <i className="fa fa-bar-chart me-3" ></i>,
                link: "/statistical",
                title: "Thống kê",
            }
        ]
    }, [])

    return (
        <>
            <div className={isActive ? 'sidenav' : "sidenav2"} id="sidebar-wrapper">
                <div className="sidebar-heading border-bottom ">
                    <div className="ms-4 mt-3">
                        <img className="rounded-circle" alt="" width="120" height="120" src="https://scontent.fsgn3-1.fna.fbcdn.net/v/t39.30808-6/301358564_2356174064558123_1914605898311611964_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGdoVzsBDf7C7HxFoS1Cev6CXmxFZfH3AgJebEVl8fcCJUM24AimozXwwonHgzp0UvW2FDHRtZAa1j6qx2Ludk6&_nc_ohc=k0mrY7I3ZFAQ7kNvgEQndLr&_nc_zt=23&_nc_ht=scontent.fsgn3-1.fna&oh=00_AYCchkiEhbvYMTf__lh2-7hSbL_xdJDfzhJNAZxzYM6m-w&oe=66BF73FC"/>
                    </div>
                </div>
                <PerfectScrollbar className="sidebar-items mt-3">
                    <ul className="list-unstyled ps-0">

                        {sidebarItems.map(item => <li className="mb-3 ms-3">
                            <Link key={item.title} tag="a" className="" to={item.link}>
                                {item.icon}{isActive && item.title}
                            </Link>
                        </li>)}

                    </ul>
                </PerfectScrollbar>
                <div
                    className={isActive ? "dropdown fixed-bottom-dropdown with200" : "dropdown fixed-bottom-dropdown with50"}>
                    <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle"
                       id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://scontent.fsgn3-1.fna.fbcdn.net/v/t39.30808-6/301358564_2356174064558123_1914605898311611964_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGdoVzsBDf7C7HxFoS1Cev6CXmxFZfH3AgJebEVl8fcCJUM24AimozXwwonHgzp0UvW2FDHRtZAa1j6qx2Ludk6&_nc_ohc=k0mrY7I3ZFAQ7kNvgEQndLr&_nc_zt=23&_nc_ht=scontent.fsgn3-1.fna&oh=00_AYCchkiEhbvYMTf__lh2-7hSbL_xdJDfzhJNAZxzYM6m-w&oe=66BF73FC" alt=""
                             className={isActive ? "rounded-circle me-2 logoprofile" : "rounded-circle me-2 logoprofile2"}/>
                        <span className={isActive ? "" : "fixed-profile"}>{name}</span>
                    </a>
                    <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                        <li><Link className="dropdown-item " to="/profile"><i className="fa fa-user-circle"
                                                                             aria-hidden="true"></i>Trang cá nhân</Link></li>
                        <li>
                            <hr className="dropdown-divider"/>
                        </li>
                        <li><a className="dropdown-item" onClick={() => {
                            logout();
                        }}><i className="fa fa-sign-out" aria-hidden="true"></i>Đăng xuất</a></li>
                    </ul>
                </div>
            </div>
        </>)
}

export default Sidebar;