import React, { useState } from 'react';
import useApi from "../../Apis/useApi";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const ResetPassword = () => {
    const  { deleteAsync, getAsync, postAsync, putAsync }  = useApi();
    const [email, setEmail] = useState("");
    const [notify, setNotify] = useState("");
    const navigate = useNavigate();
    const handleResetPassword = async () => {
        try {
            console.log(email)
            if(!email){
                setNotify("The email is required");
                return;
            }
            var res = await getAsync("/api/Auth/ForgotPassword?email=" + email);
            toast.info("Confirm the email and get new password", {
                autoClose: 3000,
              });
            navigate("/signin")
        } catch (error) {
            console.log(error)
            setNotify("The email is not existed");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundImage: 'url("https://alphagypsumboard.com/wp-content/uploads/2019/07/Background-website-01-1024x687.jpg") '}}>
            <div style={{border:"solid 1px rgb(250, 239, 239)",height:"200px",width:"400px", borderRadius:"15px", textAlign: 'center'}}>
                <h2>Forgot password</h2>
                <input type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" style={{ margin: '15px', padding: '10px', width: '80%', borderRadius: '5px', border: '1px solid #ccc' }} />
                <div style={{color:"#0ED9F5"}}>{notify}</div>
                <button onClick={handleResetPassword} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Reset Password</button>
            </div>
        </div>
    )
}

export default ResetPassword;
