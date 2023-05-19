import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom"
import "./App.scss" 
import Register from"./pages/Register/Register"
import Login from "./pages/Login/Login"
import MyStore from "./pages/MyStore/MyStore"
import MyStoreEditor from "./pages/MyStoreEditor/MyStoreEditor"
import MyProductEditor from "./pages/MyProductEditor/MyProductEditor"
import Home from "./pages/Home/Home"
import Products from "./pages/Products/Products"
import Product from "./pages/Product/Product"
import NavBar from "./components/NavBar/NavBar"
import Footer from "./components/Footer/Footer"
import Cart from "./pages/Cart/Cart"


// import RequireAuth from "./components/RequireAuth"
// import PersistLogin from "./components/PersistLogin"

const Layout = () => {
  return (
    <div>
      <NavBar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

const router = createBrowserRouter([
  {  
    path:"/",
    element:<Layout/>,
    children:[
      { path:"/",
        element: <Home/>
        //<PersistLogin element= {<RequireAuth element={ <Home /> } /> }/>
        // <RequireAuth element={ <Home /> } /> 
          
      },
      {
        path:"/products/:categoryName",
        element: <Products/>
      },
      {
        path:"/product/:productId",
        element:<Product/>
      },
      {
        path:"/register",
        element:<Register/>
      },
      {
        path:"/login",
        element:<Login/>
      },
      {
        path:"/my-store",
        element:<MyStore/>
      }, 
      {
        path:"/my-store/edit-store",
        element:<MyStoreEditor/>
      },
      {
        path:"/my-store/register",
        element:<MyStoreEditor/>
      },
      {
        path:"/my-store/edit-product/:productId",
        element:<MyProductEditor/>
      },
      {
        path:"/my-store/add-product",
        element: <MyProductEditor/>
      },
      {
        path:"/cart",
        element: <Cart/>
      }
    ]}
])
function App() {
  return (
    <div className="app">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
