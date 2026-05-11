"use client"

import { useSearchParams, useRouter } from "next/navigation"; // Correct import for App Router's useRouter
import ProductCard from "./productCard";
import { useEffect, useRef, useState } from "react";

export default function ProductList(){
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

    // For search params, use from 'next/navigation'
    const searchParams = useSearchParams();
    // To get a specific param, e.g., 'page'
    const currentPage = parseInt(searchParams.get("page") || "1", 10); // Ensure it's a number

    const pageCount = useRef(0);
    // useRouter hook from 'next/navigation' for App Router
    const router = useRouter();

    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchData(){
            // Assuming backend URL is correct and points to your API
            const res = await fetch(`${backend}/products/${currentPage}`);
            if(!res.ok){
                try{
                    const data = await res.json()
                    console.error("API Error:", data.message); // Use console.error for errors
                }
                catch(err: any){
                    console.error("Fetch Error:", err.message); // Use console.error for errors
                }
                // It's good practice to return or throw if response is not ok
                return;
            }

            const data = await res.json();
            pageCount.current = data.count; // Assuming data.count is the total number of products/pages
            setProducts(data.products);
        }

        fetchData();
    }, [currentPage, backend]); // Add backend to dependency array if it can change

    // Function to handle navigation
    const handlePageChange = (newPage: number) => {
        // Use router.push to navigate with the new page number in search params
        router.push(`/?page=${newPage}`);
    };

    return(
        <>
            <div className="product-list row">
                {
                    products.map((product, index) => (
                        <ProductCard product={product} key={index}/>
                    ))
                }
            </div>
            <div className="pagination">
                {
                    currentPage > 1 && (
                        <button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                    )
                }
                <span> Page {currentPage} </span>
                {
                    currentPage < pageCount.current && (
                        <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                    )
                }
            </div>
        </>
    )
}
