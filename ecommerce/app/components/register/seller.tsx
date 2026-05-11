"use client"

import React, {useState} from "react"

export default function SellerRegister(){
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [regState, setRegState] = useState('')
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

    async function hangleLogin(){
        if(!username.trim()){
            return setRegState('please include all the credentials.')
        }
        if(password != rePassword){
            return setRegState('repeated password is not the same as the password')
        }
        if(password.length < 6){
            return setRegState('password must be at list 6 characters')
        }
        const res = await fetch(`${backend}/auth/sell/register`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password, name})
        })

        if(!res.ok){
            try{
                const data =  await res.json()
                setRegState(data.message)
            }catch(err){
                setRegState("an error occured.")
            }
            return
        }
        
        const data =  await res.json()
        setRegState(data.message)
    }

    return(
        <>
            <h2>Login</h2>
            <div className="login-info">
                <input
                    type="text"
                    placeholder="usernmae"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>):void =>{ setName(e.target.value) }}
                />
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
                <input
                    type="password"
                    placeholder="repeat password"
                    value={rePassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>):void => {setRePassword(e.target.value)}}
                />
                <button onClick={hangleLogin}>Register</button>
                {
                    regState!='' && 
                    <div className="reg-state-box">{regState}</div>
                }
            </div>
        </>
    )
}