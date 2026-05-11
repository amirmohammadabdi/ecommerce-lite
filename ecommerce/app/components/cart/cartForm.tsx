"use client"

import { myContext } from "@/app/contexts/contextApi"
import React, { useContext, useState } from "react"

export default function CartForm({fetchFinalCart}: {fetchFinalCart: ()=>any}){
    const {userRole, cart, getTotal, clearCart} = useContext(myContext);
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL
    const [address, setAddress] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        postalCode: ''
    })
    function handleChange(e:React.ChangeEvent<HTMLInputElement>){
        setAddress({...address, [e.target.name]: e.target.value})
    }
    async function handleSubmit(e:React.SubmitEvent){
        e.preventDefault();
        if(userRole?.role != 'buy') return alert('login first')
        const res = await fetch(backend+"/buyer/cart", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem('token')||''
            },
            body: JSON.stringify({address, cart, total: getTotal()})
        })

        if(!res.ok){
            try{
                const data = await res.json()
                console.log(data.message)
            }
            catch(err:any){
                console.log(err.message)
            }
            return
        }
        const data = await res.json()
        console.log(data.message)
        clearCart()
        fetchFinalCart()
    }
    return(
        <div className="create-container" style={{paddingBottom: 20}}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="name"
                    name="name"
                    value={address.name}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="number"
                    name="phoneNumber"
                    value={address.phoneNumber}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="postalCode"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="address"
                    name="address"
                    value={address.address}
                    onChange={handleChange}
                />
                <button>Finilize</button>
            </form>
        </div>
    )
}