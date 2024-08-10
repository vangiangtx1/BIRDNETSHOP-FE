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
                                <img src="https://scontent.fsgn2-8.fna.fbcdn.net/v/t39.30808-6/280472911_2260339627474901_3106098032818695483_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeEPldT7tb_-VCFOnXCCrv50xlO-rZP6PG_GU76tk_o8bxM3v_GaoDeMcnf4jztHLwm03C0-QzvbbY5HBYLHG-xE&_nc_ohc=ovCBaSeczKgQ7kNvgHJkgJR&_nc_ht=scontent.fsgn2-8.fna&oh=00_AYBQKBKJ7-IMTnTrzDffXNFm_7fEVZ0W29_Nad_BmbUT_Q&oe=66B91727" className="img-responsive profile-img-center" alt="" />
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