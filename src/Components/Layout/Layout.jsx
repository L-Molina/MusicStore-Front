import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import NavBar from '../NavBar/NavBar'
import './Layout.css'

export default function Layout() {
  return (
    <div className="layout-root">
      <NavBar />
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
