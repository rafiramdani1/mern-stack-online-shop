import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './app/components/Home/Home'
import Login from './app/components/auth/Login'
import Register from './app/components/auth/Register'
import Layout from './app/components/Home/Layout'
import Categories from './app/components/admin/Categories/Categories'
import AddCategory from './app/components/admin/Categories/addCategory'
import SubCategories from './app/components/admin/SubCategories/SubCategories'
import EditCategory from './app/components/admin/Categories/EditCategory'
import DetailProductUser from './app/components/detailProduct/DetailProductUser'
import LayoutAdmin from './app/components/admin/LayoutAdmin'
import Dashboard from './app/components/admin/Dashboard'
import RefreshToken from './app/components/RefreshToken'
import AddSubCategory from './app/components/admin/SubCategories/AddSubCategory'
import EditSubCategory from './app/components/admin/SubCategories/EditSubCategory'
import Products from './app/components/admin/Products/Products'
import AddProduct from './app/components/admin/Products/AddProduct'
import EditProduct from './app/components/admin/Products/EditProduct'
import DetailProduct from './app/components/admin/Products/detailProduct/DetailProduct'
import ProductsByCategory from './app/components/products/ProductsByCategory'
import ProductsSearchResults from './app/components/products/ProductsSearchResults'
import VerifyEmail from './app/components/auth/VerifyEmail'


function App() {
  return (
    <div className='font-URL'>

      <BrowserRouter>
        <Routes>

          {/* ROUTE AUTH */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/user/verify/:id/:token' element={<VerifyEmail />} />

          {/* refesh token */}  
          <Route element={<RefreshToken />}>

            {/* public route */}
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='/product/:slug' element={<DetailProductUser />} />
              <Route path='products/search' element={<ProductsSearchResults />} />
              <Route path='/products' element={<ProductsByCategory />} />
            </Route>

            {/* Require auth admin */}
            <Route path='/admin/dashboard' element={<LayoutAdmin />}>
              <Route index element={<Dashboard />} />

              {/* categories route */}
              <Route path='categories' element={<Categories />}>
                <Route path='add-category' element={<AddCategory />} />
                <Route path='edit/:id' element={<EditCategory />} />
              </Route>

              {/* sub categories route */}
              <Route path='sub-categories' element={<SubCategories />}>
                <Route path='add-sub-category' element={<AddSubCategory />} />
                <Route path='edit/:id' element={<EditSubCategory />} />
              </Route>

              {/* products route */}
              <Route path='products' element={<Products />} />
              <Route path='products/add-product' element={<AddProduct />} />
              <Route path='products/edit/:id' element={<EditProduct />} />
              <Route path='products/detail/:id' element={<DetailProduct />} />

            </Route>

          </Route>

          {/* <Route path='/register' element={<Register />} /> */}
          {/* <Route path='/user/verify/:id/:token' element={<VerifyEmail />} /> */}

          {/* ROUTE PUBLIC */}
          {/* <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/products/:slug/:slug' element={(<DetailProductUser />)} />
          </Route> */}

          {/* ROUTE ADMIN */}
          {/* <Route element={<LayoutAdmin />}>
            <Route
              path='/admin/dashboard'
              element={<Dashboard />}
            />

            <Route path='/admin/dashboard/categories' element={<Categories />}>
              <Route path='add-category' element={<AddCategory />} />
              <Route path='edit/:id' element={<EditCategory />} />
            </Route>
            <Route path='/admin/dashboard/sub-categories' element={<SubCategories />} />
          </Route> */}

          {/* <Route path='/admin/dashboard/categories' element={(<Categories />)} />
          <Route path='/admin/dashboard/categories/add-category' element={(<>
            <NavbarAdmin /> <Categories /> <AddCategory />
          </>)} />
          <Route path='/admin/dashboard/categories/edit/:id' element={(<>
            <NavbarAdmin /> <Categories /> <EditCategory />
          </>)} />

          <Route path='/admin/dashboard/sub-categories' element={(<SubCategories />)} />
          <Route path='/admin/dashboard/sub-categories/add-sub-categories' element={(<>
            <NavbarAdmin /> <SubCategories /> <AddSubCategories />
          </>)} />
          <Route path='/admin/dashboard/sub-categories/edit/:id' element={(<>
            <NavbarAdmin /> <SubCategories /> <EditSubCategory />
          </>)} />

          <Route path='/admin/dashboard/products' element={(<Products />)} />
          <Route path='/admin/dashboard/products/add-products' element={(<>
            <NavbarAdmin /> <AddProducts />
          </>)} />
          <Route path='/admin/dashboard/products/edit/' element={(<>
            <NavbarAdmin /> <EditProduct />
          </>)} />
          <Route path='/admin/dashboard/products/detail/:id' element={(<>
            <NavbarAdmin /> <DetailProduct />
          </>)} /> */}

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
