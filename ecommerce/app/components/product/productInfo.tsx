"use client"
import { myContext } from "@/app/contexts/contextApi";
import { ServerProduct } from "@/app/product/[id]/page";
import { useContext } from "react";

export default function ProductInfo({product}: {product: ServerProduct}){
    const { userRole, addToCart } = useContext(myContext);
    let features = product.features.split("/")
    return(
        <div className="col-md-6 col-12" style={{padding: 20}}>
            <div className="info-box">
                <h3><span>name: </span>{product.name}</h3>
                <h3><span>price: </span>{product.price}$</h3>
                <h3><span>category: </span>{product.category}</h3>
                <h3><span>number: </span>{product.number}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>feature</th>
                            <th>value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            features.map((feature, index) => {
                                let fs = feature.split(':')
                                return(
                                    <tr key={index}>
                                        <th>{fs[0]}</th>
                                        <th>{fs[1]}</th>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                { userRole?.role!='sell' && <button onClick={()=>{addToCart(product)}}>Add to Cart</button> }
            </div>
        </div>
    )
}