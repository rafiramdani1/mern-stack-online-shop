import Header from '../layouts/Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Header />
      <main className=''>
        <Outlet />
      </main>
    </>
  )
}

export default Layout