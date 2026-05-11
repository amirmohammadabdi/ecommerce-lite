"use client"

import { useContext, useEffect, useState } from "react"
import { myContext } from "../contexts/contextApi"
import CartForm from "../components/cart/cartForm"
import FinalCart from "../components/cart/finalCart"

export interface FinalCartType{
    total: number,
    address: {
        name: string,
        address: string,
        phoneNumber: string,
        postalCode: string
    },
    buyer: string,
    status: string
    products: any[]
}

export default function Cart(){

    const { cart, remove, increase, decrease, clearCart, getTotal } = useContext(myContext)
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL
    const [finalCart, setFinalCart] = useState<FinalCartType[]>([])

    async function fetchFinalCart(){
        const res = await fetch(backend+"/buyer/cart",{
            headers: {Authorization: localStorage.getItem('token')||''},
            method: 'GET'
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
        setFinalCart(data.carts)
    }

    useEffect(() => {
        fetchFinalCart()
    }, [])


    return(
        <>
            <div style={{marginTop: 20, padding: 20}}>
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>information</th>
                            <th>quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cart.map((product, index) => (
                                <tr key={index}>
                                    <th>{index + 1}. {product.name} - {product.price}$</th>
                                    <th>
                                        {
                                            product.quantity! > 1 &&
                                            <button onClick={()=>{decrease(product._id)}}>-</button>
                                        }
                                        { product.quantity }
                                        {
                                            product.quantity! < product.number &&
                                            <button onClick={()=>{increase(product._id)}}>+</button>
                                        }
                                        <button onClick={()=>{remove(product._id)}}>remove</button>
                                    </th>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {
                    cart.length>0 &&
                    <>
                        <div className="cart-total-price">
                            total price: {getTotal()}$
                        </div>
                        <div style={{textAlign: "center"}}>
                            <button className="clear-btn" onClick={() => {
                                clearCart()
                            }}>clear the cart</button>
                        </div>
                    </>
                }
                {
                    (!cart || cart.length==0) &&
                    <div className="cart-total-price">
                        cart is empty!
                    </div>
                }
            </div>
            {cart.length>0 && <CartForm fetchFinalCart={fetchFinalCart}/>}
            { finalCart.length>0 && <FinalCart finalCart={finalCart}/> }
        </>
    )
}