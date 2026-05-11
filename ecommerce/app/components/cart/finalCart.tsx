import { FinalCartType } from "@/app/cart/page";
import Link from "next/link";

export default function FinalCart({finalCart}: {finalCart: FinalCartType[]}){
    return(
        <>
            {
                <div style={{padding: 20, marginBottom: 50}}>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>i</th>
                                <th>name</th>
                                <th>status</th>
                                <th>address</th>
                                <th>products</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                finalCart.map((cart, index) => {
                                    return(
                                        <tr key={index}>
                                            <th>{index+1}</th>
                                            <th>{cart.address.name}</th>
                                            <th>{cart.status}</th>
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
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            }
        </>
    )
}