"use client"

import PannelUl from "@/app/components/sellerCom/pannelUl";
import Link from "next/link";
import { useEffect, useState } from "react";
export interface SellerCart{
    seller: string,
    address: {
        name: string,
        address: string,
        phoneNumber: string,
        postalCode: string
    },
    cartId: string,
    products: any[]
}
export default function Cart(){
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL
    const [carts, setCarts] = useState<SellerCart[]>([])
    
    async function fetchData(){
        const res = await fetch(backend+"/seller/cart", {
            method: 'GET',
            headers: {Authorization: localStorage.getItem('token')||''}
        })
        
        if(!res.ok){
            try{
                const data = await res.json()
                console.log(data.message)
            }
            catch(err:any){
                console.log(err.message)
            }
        }else{
            const data = await res.json()
            console.log(data.message)
            setCarts(data.carts)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    return(
        <>
            {
                <div style={{padding: 20, marginBottom: 50}}>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>i</th>
                                <th>name</th>
                                <th>address</th>
                                <th>products</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                carts.map((cart, index) => (
                                    <tr key={index}>
                                        <th>{index+1}</th>
                                        <th>{cart.address.name}</th>
                                        <th>
                                            {cart.address.address}<br/>
                                            {cart.address.postalCode}<br/>
                                            {cart.address.phoneNumber}
                                        </th>
                                        <th>
                                            {
                                                cart.products.map(product => (
                                                    <div key={product.product._id}><Link href={`/product/${product.product._id}`}>{product.product.name}</Link> - {product.quantity}</div>
                                                ))
                                            }
                                        </th>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            }
            <PannelUl/>
        </>
    )
}