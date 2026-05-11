"use client"

import { myContext } from "@/app/contexts/contextApi"
import React, { useContext, useState } from "react"

export default function LoginBox({sellOrBuy}: {sellOrBuy: string}){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [logState, setLogState] = useState('')
    const { setUserRole } = useContext(myContext);
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

    async function hangleLogin(){
        console.log(sellOrBuy)
        console.log(`${backend}/auth/login/${sellOrBuy}`)
        const res = await fetch(`${backend}/auth/login/${sellOrBuy}`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        
        if(!res.ok){
            try{
                const data =  await res.json()
                setLogState(data.message)
            }catch(err){
                setLogState("an error occured.")
            }
            return 
        }
        
        const data =  await res.json()
        setLogState(data.message)
        console.log(data)
        localStorage.setItem('token', data.token)
        setUserRole(data.payload)
    }

    return(
        <>
            <h2>Login</h2>
            <div className="login-info">
                <input
                    type="text"
                    placeholder="usernmae"
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>):void =>{ setUsername(e.target.value) }}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>):void => {setPassword(e.target.value)}}
                />
                <button onClick={hangleLogin}>Login</button>
                {
                    logState!='' && 
                    <div className="reg-state-box">{logState}</div>
                }
            </div>
        </>
    )
}