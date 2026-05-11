import ProductList from "./components/product/productList";

export default function Home(){
  return(
    <main className="home">
      <div className="porducts-cover">
        <ProductList/>
      </div>
    </main>
  )
}