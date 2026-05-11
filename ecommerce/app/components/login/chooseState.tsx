"use client"

import { useState } from "react"

export default function ChooseState({setSellOrBuy, setRegisterOrLogin}: {setSellOrBuy:(value: string)=>void, setRegisterOrLogin:(value:string)=>void}){
    const [role, setRole] = useState('')
    return(
        <>
            <h2>Choose Your Role</h2>
            <div className="btn-box">
                <div className={`seller-btn ${role=='sell'?'sell-selected':''}`} onClick={() => { setRole('sell') }}>Sell</div>
                <div className={`buyer-btn ${role=='buy'?'buy-selected':''}`} onClick={() => { setRole('buy') }}>Buy</div>
            </div>
            {
                role != '' &&
                <div className="btn-box">
                    <div className="buyer-btn" onClick={() => {
                        setRegisterOrLogin('login')
                        setSellOrBuy(role);
                    }}>Login</div>
                    <div className="seller-btn" onClick={() => {
                        setRegisterOrLogin('register')
                        setSellOrBuy(role);
                    }}>Register</div>
                </div>
            }
        </>
    )
}