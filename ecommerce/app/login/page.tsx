"use client"

import { useState } from "react";
import ChooseState from "../components/login/chooseState";
import LoginBox from "../components/login/login"
import SellerRegister from "../components/register/seller";
import BuyerRegister from "../components/register/buyer";

export default function Login(){
    const [sellOrBuy, setSellOrBuy] = useState('')
    const [registerOrLogin, setRegisterOrLogin] = useState('')
    return(
        <div className="login-cover">
            <div className="login-box">
                { sellOrBuy=="" && <ChooseState setSellOrBuy={setSellOrBuy} setRegisterOrLogin={setRegisterOrLogin} /> }
                {
                    sellOrBuy!="" &&
                    <div className="restore-login" onClick={()=>{
                        setSellOrBuy('')
                    }}>B</div>
                }
                { registerOrLogin=="login" && sellOrBuy!='' && <LoginBox sellOrBuy={sellOrBuy}/> }
                { registerOrLogin=="register" && sellOrBuy=="sell" && <SellerRegister/> }
                { registerOrLogin=="register" && sellOrBuy=="buy" && <BuyerRegister/> }
            </div>
        </div>
    )
}