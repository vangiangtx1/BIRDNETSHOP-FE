import React from "react";
import adminLayout from "../admin/adminLayout"
import "./../assets/css/profile.css"
import { NavLink } from "react-router-dom";

const userProfileLayout = (ChildComponent) => {
    class UserProfilePageHoc extends React.Component {
        constructor(props){
            super(props);
    
            this.state = {}
        }
    
        render(){
            return <>
                <div className="container">
                <div className="row profile">
                    <div className="col-md-3">
                            <div className="profile-sidebar">
                                <div className="my-3 p-3 bg-body rounded shadow-sm">

                                {/* <!-- SIDEBAR USERPIC --> */}
                            <div className="profile-userpic">
                                <img src="https://scontent.fsgn3-1.fna.fbcdn.net/v/t39.30808-6/301358564_2356174064558123_1914605898311611964_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGdoVzsBDf7C7HxFoS1Cev6CXmxFZfH3AgJebEVl8fcCJUM24AimozXwwonHgzp0UvW2FDHRtZAa1j6qx2Ludk6&_nc_ohc=k0mrY7I3ZFAQ7kNvgEQndLr&_nc_zt=23&_nc_ht=scontent.fsgn3-1.fna&oh=00_AYCchkiEhbvYMTf__lh2-7hSbL_xdJDfzhJNAZxzYM6m-w&oe=66BF73FC" className="img-responsive profile-img-center" alt="" />
                            </div>
                            {/* <!-- END SIDEBAR USERPIC -->
                            <!-- SIDEBAR USER TITLE --> */}
                            <div className="profile-usertitle">
                                <div className="profile-usertitle-name">
                                    Quản Trị Viên
                                </div>
                            </div>
                            <hr/>                
                            <div>
                                <div className="bd-example">
                                <div className="list-group">
                                    <NavLink  to="/profile" className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active': ''}`}>Thông tin cá nhân</NavLink>
                                    <NavLink to="/change-password" className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active': ''}`}>Thay đổi mật khẩu</NavLink>
                                </div>
                            </div>
                                </div>
                            </div>
                            
                            
                            </div>
                            </div>
                            <div className="col-md-9">
                                <div className="profile-content">
                                    <ChildComponent {...this.props} />
                                </div>
                            </div>
                        </div>
                    </div>
            </>
        }
    }

    return adminLayout(UserProfilePageHoc);
}


export default userProfileLayout;