import { useState } from "react"

export default function ImgCom({imgs, name}: {imgs:[string], name:string}){
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL
    const [mainImg, setMainImg] = useState(imgs[0])
    return(
        <div className="col-md-6 col-12" style={{padding: 20}}>
                <div className="product-img-box">
                    <div className="main-img">
                        <img src={backend+"/uploads/"+mainImg} alt={"product img "+name} />
                    </div>
                    <div className="img-loop">
                        {
                            imgs.map((img, index) => (
                                <div key={index}>
                                    <img className={img==mainImg?"selected":""} src={backend+"/uploads/"+img} alt={"product img "+name} onClick={() => {
                                        setMainImg(img)
                                    }} />
                                </div>
                            ))
                        }
                    </div>
                </div>
        </div>
    )
}