"use client"
import { myContext } from "@/app/contexts/contextApi";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";

export default function HeaderUl(){
    const [ulState, setUlState] = useState<number>(-250)
    const {userRole, setUserRole} = useContext(myContext)
    const startX = useRef(0)
    function handleUl(){
        console.log(ulState)
        if(ulState == 0){
            return setUlState(-250)
        }
        setUlState(0)
    }
    useEffect(() => {
        const threshhold = 100
        function onPointerDown(e: PointerEvent){
            startX.current = e.clientX
        }
        function onPointerUp(e: PointerEvent){
            const delta =  e.clientX - startX.current
            
            if(delta < -threshhold){
                setUlState(0)
            }
            if(delta > threshhold){
                setUlState(-250)
            }
            console.log(delta)
        }
        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointerup', onPointerUp);
        return () => {
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [])
    return(
        <>
            <ul style={{right: `${ulState}px`}}>
                <li><Link href={'/'}>Products</Link></li>
                { (userRole?.role=='buy' || userRole==null ) && <li><Link href={'/cart'}>Cart</Link></li>}
                { userRole==null && <li><Link href={'/login'}>Login/register</Link></li>}
                { userRole?.role=='sell' && <li><Link href={'/pannel'}>Pannel</Link></li>}
                { userRole!=null && <li><Link href={'/'} onClick={() => {
                    localStorage.setItem('token', '');
                    setUserRole(null)
                }}>LoginOut</Link></li> }
            </ul>
            <button className="menu-btn" onClick={handleUl}>menu</button>
            {ulState == 0 && <div className="dark-back" onClick={handleUl}></div>}
        </>
    )
}