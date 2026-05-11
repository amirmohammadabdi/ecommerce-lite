import Link from "next/link";
interface Product{
    _id: String,
    name: String,
    price: String,
    imgs: [String]
}
export default function ProductCard({product}: {product: Product}){
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL
    return(
        <div className="product-card-cover col-lg-3 col-md-4 col-sm-6">
            <div className="product-card">
                <Link href={`product/${product._id}`}><img src={backend+"/uploads/"+product.imgs[0]} alt={`product's img ${[product.name]}`} /></Link>
                <h3><Link href={`product/${product._id}`}>{product.name}</Link></h3>
                <h3>price: <span>{product.price}$</span></h3>
            </div>
        </div>
    )
}