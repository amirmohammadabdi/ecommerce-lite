"use client"
import Link from "next/link";
import PannelUl from "../components/sellerCom/pannelUl";
import { useEffect, useState } from "react";
import DeleteProduct from "../components/sellerCom/delete";

export default function Pannel(){
    const [deleteProduct, setDeleteProduct] = useState<string|null>(null)
    const [products, setProducts] = useState([])
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL

    useEffect(() => {
        async function fetchData(){
            const res = await fetch(backend+"/seller/products", {
                method: "GET",
                headers: {Authorization: localStorage.getItem('token')||''}
            })
            if(!res.ok){
                try{
                    const data = await res.json()
                    console.log(data.message)
                }
                catch(err:any){
                    console.log((err.message))
                }
                return
            }
            const data = await res.json()
            console.log(data.message)
            setProducts(data.products)
        }
        fetchData()
    }, [])
    return(
        <>
            <PannelUl/>
            <div className="seller-container">
                <table>
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product, index) => (
                                <tr key={index}>
                                    <th>{index+1} - {product.name}</th>
                                    <th>
                                        <button onClick={()=>{setDeleteProduct(product._id)}}>remove</button>
                                        <button><Link href={`/pannel/edit/${product._id}`}>edit</Link></button>
                                    </th>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {deleteProduct!=null && <DeleteProduct deleteProduct={deleteProduct} setDeleteProduct={setDeleteProduct}/>}
        </>
    )
}