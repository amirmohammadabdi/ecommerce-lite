import Link from "next/link";

export default function PannelUl(){
    return(
        <div className="pannel-ul-over">
            <ul className="pannel-ul">
                <li><Link href="/pannel/create">Create</Link></li>
                <li><Link href="/pannel">Home</Link></li>
                <li><Link href="/pannel/cart">Cart</Link></li>
            </ul>
        </div>
    )
}