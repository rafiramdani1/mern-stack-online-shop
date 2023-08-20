import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './components/Home/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/admin/Dashboard'
import Categories from './components/admin/categories/Categories'
import AddCategory from './components/admin/categories/AddCategory'
import NavbarAdmin from './components/admin/NavbarAdmin'
import EditCategory from './components/admin/categories/EditCategory'
import { SubCategoriesProvider } from './components/admin/sub-categories/SubCategoriesContext'
import SubCategories from './components/admin/sub-categories/SubCategories'
import AddSubCategories from './components/admin/sub-categories/AddSubCategories'
import EditSubCategory from './components/admin/sub-categories/EditSubCategory'
import { ProductsProvider } from './components/admin/products/ProductsContext'
import Products from './components/admin/products/Products'
import AddProducts from './components/admin/products/AddProducts'
import EditProduct from './components/admin/products/EditProduct'
import { CategoriesProvider } from './components/admin/categories/CategoriesContext'
import DetailProduct from './components/admin/products/detailProducts/DetailProduct'
import DetailProductUser from './components/DetailProduct/DetailProductUser'
import { CartsProvider } from './components/admin/CartsContext'

function App() {
  return (
    <div className='font-URL'>
      <CartsProvider>
        <CategoriesProvider>
          <SubCategoriesProvider>
            <ProductsProvider>
              <BrowserRouter>
                <Routes>
                  <Route path='/' element={<Home />} />

                  <Route path='/products/:slug/:slug' element={(<DetailProductUser />)} />

                  <Route path='/login' element={<Login />} />
                  <Route path='/register' element={<Register />} />

                  {/* ROUTE ADMIN */}
                  <Route path='/admin/dashboard' element={<Dashboard />} />

                  <Route path='/admin/dashboard/categories' element={(<Categories />)} />
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
                  </>)} />

                </Routes>
              </BrowserRouter>
            </ProductsProvider>
          </SubCategoriesProvider>
        </CategoriesProvider>
      </CartsProvider>
    </div>
  )
}

export default App
