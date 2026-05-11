"use client"
import PannelUl from "@/app/components/sellerCom/pannelUl";
import { useState } from "react";

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
    const [files, setFiles] = useState<FileList|null>(null)
    const [uploadState, setUploadState] = useState('')
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL


    function handleChange(e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>){
        setInfo({...info, [e.target.name]: e.target.value})
    }
    async function handleSubmit(e:React.SubmitEvent){
        e.preventDefault()
        setUploadState('trying to upload the file.');

        if(!files) return setUploadState('please select the product pictures.')
        const formData = new FormData()
        Array.from(files).forEach(file => {
            formData.append("photo", file)
        });
        formData.append("name", info.name)
        formData.append("price", info.price)
        formData.append("number", (info.number).toString())
        formData.append("category", info.category)
        formData.append("features", info.features)
        const token = localStorage.getItem('token') || ''
        const res = await fetch(backend+"/seller/upload", {
            method: "POST",
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
        setInfo({
            name:'',
            price: '',
            category: 'phone',
            number: 0,
            features: ''
        })
        setFiles(null)
    }
    return(
        <>
            <div className="create-container">
                <form onSubmit={handleSubmit}>
                    <h2>Create</h2>
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
                    <button>Create</button>
                    {uploadState!='' && <div className="reg-state-box">{uploadState}</div>}
                </form>
            </div>
            <PannelUl/>
        </>
    )
}