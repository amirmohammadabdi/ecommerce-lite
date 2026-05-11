"use client"

import ImgCom from "@/app/components/product/imgsCom"
import ProductInfo from "@/app/components/product/productInfo"
import  type { Product } from "@/app/contexts/contextApi"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export interface ServerProduct extends Product{
    CreateAt: Date,
    UpdatedAt: Date
}

export default function Product(){
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL
    const {id} = useParams()
    const [product, setProduct] = useState<ServerProduct | null>(null)
    useEffect(() => {
        async function fetchData(){
            const res = await fetch(backend+"/product/"+id)
            if(!res.ok){
                try{
                    const data = await res.json()
                    console.log(data.message)
                }
                catch(err:any){
                    console.log(err.message)
                }
            }
            const data = await res.json()
            console.log(data.message)
            setProduct(data.product)
        }
        fetchData()
    }, [])
    return(
        <div className="single-product-container row">
            {product!=null && <ImgCom imgs={product.imgs} name={product.name} />}
            {product!=null && <ProductInfo product={product} />}
        </div>
    )
}