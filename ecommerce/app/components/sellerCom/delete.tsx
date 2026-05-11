"use client"
export default function DeleteProduct({deleteProduct, setDeleteProduct}: {deleteProduct:string, setDeleteProduct: (value:string|null)=>void}){
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL
    async function handleDelete(){
        setDeleteProduct(null)
        const res = await fetch(backend+"/seller/product/"+deleteProduct, {
            method:"DELETE",
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
    }
    return(
        <div className="delete-dark-back">
            <div className="delete-box">
                <h3>Are you sure?</h3>
                <div className="btn-box">
                    <button style={{marginRight: '10px'}} onClick={handleDelete}>Yes</button>
                    <button onClick={()=>{setDeleteProduct(null)}}>No</button>
                </div>
            </div>
        </div>
    )
}