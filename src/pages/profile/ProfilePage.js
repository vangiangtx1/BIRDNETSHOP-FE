import { useState, useEffect } from "react";
import "../../assets/css/profile.css"
import userProfileLayout from "../../admin/userProfileLayout";
import axios from '../../api/axios';
import axiosApiInstance from "../../context/interceptor";

const ProfilePage = () => {
    const [email, setEmail] = useState(['']);
    const [firstName, setFirstName] = useState(['']);
    const [lastName, setLastName] = useState(['']);
    const [phone, setPhone] = useState(['']);
    const [gender, setGender] = useState(['']);

    async function getProfileUser() {
        return await fetch(axiosApiInstance.defaults.baseURL + "/api/user/profile", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("tokens")).data?.accessToken
            },
        })
            .then(response => response.json().then(res => {
                setFirstName(res.data?.data?.firstName)
                setLastName(res.data?.data?.lastName)
                setEmail(res.data?.data?.email)
                setPhone(res.data?.data?.phone)
                setGender(res.data?.data?.gender)
            }))
    }

    useEffect(() => {
        getProfileUser();
    }, []);
    return <>
        <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h6 className="border-bottom pb-2 mb-0 mb-3" style={{fontSize:"25px"}}>Thông tin cá nhân</h6>
            <form>
                <div className="row">
                    <div className="col">
                        <label htmlFor="exampleInputEmail1" className="form-label">Họ</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="First Name" value={firstName} />
                            <span className="input-group-text" id="basic-addon2"><i className="fa fa-user"></i></span>
                        </div>
                    </div>
                    <div className="col">
                        <label htmlFor="exampleInputEmail1" className="form-label">Tên</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Last Name" value={lastName} />
                            <span className="input-group-text" id="basic-addon2"><i className="fa fa-user"></i></span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label htmlFor="exampleInputEmail1" className="form-label">Giới tính</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Username" value={gender} />
                            <span className="input-group-text" id="basic-addon2"><i className="fa fa-user"></i></span>
                        </div>
                    </div>
                    <div className="col">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Email Address" value={email} />
                            <span className="input-group-text" id="basic-addon2">@</span>
                        </div>
                    </div>
                </div>


                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="exampleInputEmail1" className="form-label">Số điện thoại</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Contact Number" value={phone} />
                            <span className="input-group-text" id="basic-addon2"><i className="fa fa-mobile"></i></span>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-default">Xác Nhận</button>
            </form>
        </div>

    </>
}

export default userProfileLayout(ProfilePage);