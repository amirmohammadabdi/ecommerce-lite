"use client"
import { createContext, ReactNode, useEffect, useState } from "react";

export interface Product{
  _id: string,
  name: string,
  price: string,
  imgs: [string],
  number: number,
  category: string,
  features: string,
  quantity?: number
}
interface Payload{
  id: string,
  role: string,
  username?: string,
  name?: string
}
interface ContextType {
  cart: Product[],
  userRole: Payload|null,
  setUserRole: (value: Payload|null) => void,
  addToCart: (product: Product) => void,
  increase: (id: string) => void,
  decrease: (id: string) => void,
  remove: (id: string) => void,
  clearCart: () => void,
  getTotal: ()=> number,
}

export const myContext = createContext({} as ContextType)

const backend = process.env.NEXT_PUBLIC_BACKEND_URL

export function ContextProvider({children}: {children: ReactNode}){
  const [cart, setCart] = useState<Product[]>([])
  const [userRole, setUserRole] = useState<Payload|null>(null)

  useEffect(() => {
    if(localStorage.getItem('cart') != null){
      setCart(JSON.parse(localStorage.getItem('cart')!))
    }
    async function fetchData(){
      const token = localStorage.getItem('token') || '';
      const res = await fetch(backend+"/userState", {
        method: "GET",
        headers: {Authorization: token}
      })
      if(!res.ok){
        return setUserRole(null)
      }
      const data = await res.json()
      setUserRole(data)
    }
    fetchData()
  }, [])
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])


  function addToCart(product: Product){
    let newCart:Product[] = []
    let found = false
    cart.forEach(item => {
      if(product._id == item._id){
        found = true
        newCart.push({...item, quantity: item.quantity!<item.number?item.quantity!+1:item.quantity})
      }
      else{
        newCart.push(item)
      }
    })
    if(!found){
      newCart.push({...product, quantity: 1})
    }
    setCart(newCart)
  }
  function increase(id: string){
    let newCart:Product[] = []
    cart.forEach(item => {
      if(item._id == id){
        newCart.push({...item, quantity: item.quantity!<item.number?item.quantity!+1:item.quantity})
      }else{
        newCart.push({...item})
      }
    })

    setCart(newCart)
  }
  function decrease(id: string){
    let newCart:Product[] = []
    cart.forEach(item => {
      if(item._id == id){
        newCart.push({...item, quantity: item.quantity!-1})
      }else{
        newCart.push({...item})
      }
    })

    setCart(newCart)
  }
  function remove(id: string){
    let newCart:Product[] = []
    cart.forEach(item => {
      if(item._id != id){
        newCart.push({...item})
      }
    })

    setCart(newCart)
  }
  function getTotal(){
    let total = 0
    cart.forEach(p => {
      total += p.quantity! * parseFloat(p.price)
    })
    return total
  }
  function clearCart(){
    setCart([])
  }

  return(
    <myContext.Provider value={{cart, addToCart, remove, increase, decrease, clearCart, userRole, setUserRole, getTotal}}>
      {children}
    </myContext.Provider>
  )
}