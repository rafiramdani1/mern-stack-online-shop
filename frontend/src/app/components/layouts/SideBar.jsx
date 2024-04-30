import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

const SideBar = () => {
  const location = useLocation()
  const [activeMenu, setActiveMenu] = useState(
    localStorage.getItem('activeMenu') || 'dashboard'
  )

  useEffect(() => {
    if (location.pathname.endsWith('/admin/dashboard')) {
      setActiveMenu('dashboard');
      localStorage.setItem('activeMenu', 'dashboard');
    }
  }, [location])

  const handleActiveMenu = (name) => {
    setActiveMenu(name)
    localStorage.setItem('activeMenu', name)
  }

  return (
    <>
      <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-zinc-100 border-r border-gray-200 sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-zinc-100">
          <ul className="space-y-2 font-medium">
            <li>
              <Link to='/admin/dashboard' onClick={() => handleActiveMenu('dashboard')} className={`flex items-center p-2 text-textPrimary hover:text-textHoverPrimary hover:bg-neutral-300 rounded-lg ${activeMenu === 'dashboard' ? 'bg-neutral-300' : ''}`}>
                <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to='/admin/dashboard/categories' onClick={() => handleActiveMenu('categories')} className={`flex items-center p-2 text-textPrimary hover:text-textHoverPrimary hover:bg-neutral-300 rounded-lg ${activeMenu === 'categories' ? 'bg-neutral-300' : ''}`}>
                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                <span className="flex-1 ml-3 whitespace-nowrap">Categories</span>
              </Link>
            </li>
            <li>
              <Link to='/admin/dashboard/sub-categories' onClick={() => handleActiveMenu('subCategories')} className={`flex items-center p-2 text-textPrimary hover:text-textHoverPrimary hover:bg-neutral-300 rounded-lg ${activeMenu === 'subCategories' ? 'bg-neutral-300' : ''}`}>
                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                <span className="flex-1 ml-3 whitespace-nowrap">Sub Categories</span>
              </Link>
            </li>
            <li>
              <Link to='/admin/dashboard/products' onClick={() => handleActiveMenu('products')} className={`flex items-center p-2 text-textPrimary hover:text-textHoverPrimary hover:bg-neutral-300 rounded-lg ${activeMenu === 'products' ? 'bg-neutral-300' : ''}`}>
                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
                <span className="flex-1 ml-3 whitespace-nowrap">Products</span>
              </Link>
            </li>
            <li>
              <Link to='#' onClick={() => handleActiveMenu('users')} className={`flex items-center p-2 text-textPrimary hover:text-textHoverPrimary hover:bg-neutral-300 rounded-lg ${activeMenu === 'users' ? 'bg-neutral-300' : ''}`}>
                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                <span className="flex-1 ml-3 whitespace-nowrap">Users</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>

  )
}

export default SideBar
