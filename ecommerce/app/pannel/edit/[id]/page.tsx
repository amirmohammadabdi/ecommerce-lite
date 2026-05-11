"use client"
import PannelUl from "@/app/components/sellerCom/pannelUl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface uploadInfo{
    name:string,
    price: string,
    category: string,
    number: number,
    features: string
}
export default function Create(){
    const [info, setInfo] = useState<uploadInfo>({
        name:'',
        price: '',
        category: 'phone',
        number: 0,
        features: ''
    })
    const {id} = useParams()
    const [files, setFiles] = useState<FileList|null>(null)
    const [uploadState, setUploadState] = useState('')
    const [uploadedImgs, setUpaloadedImgs] = useState<string[]>([])
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL

    useEffect(() => {
        console.log(id)
        async function fetchData(){
            const res = await fetch(backend+"/seller/product/"+id, {
                method: "GET",
                headers: {Authorization: localStorage.getItem('token')||''}
            })
            if(!res.ok){
                try{
                    const data = await res.json()
                    console.log(data.message)
                }
                catch(err: any){
                    console.log(err.message)
                }
                return
            }
            const data = await res.json()
            setInfo({
                name: data.product.name,
                price: data.product.price,
                category: data.product.category,
                number: data.product.number,
                features: data.product.features
            })
            setUpaloadedImgs(data.product.imgs)
            console.log(data)
        }

        fetchData();
    }, [])

    function handleChange(e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>){
        setInfo({...info, [e.target.name]: e.target.value})
    }
    async function handleSubmit(e:React.SubmitEvent){
        e.preventDefault()
        setUploadState('trying to upload the file.');

        const formData = new FormData()
        if(files){
            Array.from(files).forEach(file => {
                formData.append("photo", file)
            });
        }
        formData.append("name", info.name)
        formData.append("price", info.price)
        formData.append("number", (info.number).toString())
        formData.append("category", info.category)
        formData.append("features", info.features)
        const token = localStorage.getItem('token') || ''
        const res = await fetch(backend+"/seller/product/"+id, {
            method: "PUT",
            headers: {Authorization: token},
            body: formData
        })
        if(!res.ok){
            try{
                const data = await res.json()
                setUploadState(data.message)
            }
            catch(err: any){
                setUploadState(err.message)
            }
            return
        }
        const data = await res.json()
        setUploadState(data.message)
        setUpaloadedImgs([...uploadedImgs, ...data.newImgs])
        setFiles(null)
    }
    async function deleteImg(img: string){
        const res = await fetch(backend+'/seller/deleteImg/'+id, {
            method: 'PUT',
            headers: {Authorization: localStorage.getItem('token')||'', 'Content-Type': 'application/json'},
            body: JSON.stringify({img})
        })
        console.log(img)
        
        if(!res.ok){
            try{
                const data = await res.json()
                console.log(data.message)
            }
            catch(err: any){
                console.log(err.message)
            }
            return
        }
        setUpaloadedImgs(uploadedImgs.filter(uI => uI != img))
    }
    return(
        <>
            <div className="create-container">
                <form onSubmit={handleSubmit}>
                    <h2>Update</h2>
                    <div className="uploaded-imgs" style={{marginTop: 20}}>
                        {
                            uploadedImgs.map((img, index) => (
                                <div className="up-img-over" key={index}>
                                    <div className="upload-img-box">
                                        <img src={backend+"/uploads/"+img} alt={`porduct img ${img}`} />
                                        <button type="button" onClick={()=>{deleteImg(img)}}>delete</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <input className="file-input" type="file" multiple onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
                        setFiles(e.target.files)
                    }} />
                    <input
                        type="text"
                        placeholder="name"
                        name="name"
                        value={info.name}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        placeholder="price"
                        name="price"
                        value={info.price}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        placeholder="number"
                        name="number"
                        value={info.number}
                        onChange={handleChange}
                    />
                    <input
                        type="string"
                        placeholder="feature:value/..."
                        name="features"
                        value={info.features}
                        onChange={handleChange}
                    />
                    <div className="select-box">
                        <label>Category: </label>
                        <select name="category" value={info.category} onChange={handleChange}>
                            <option value="phone">phone</option>
                            <option value="pc">pc</option>
                        </select>
                    </div>
                    <button>Update</button>
                    {uploadState!='' && <div className="reg-state-box">{uploadState}</div>}
                </form>
            </div>
            <PannelUl/>
        </>
    )
}