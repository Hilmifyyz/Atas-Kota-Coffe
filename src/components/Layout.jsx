import Navbar from './Navbar'

function Layout({ children }) {
    return (
        <div className="w-screen min-h-screen bg-gray-100">
            <Navbar />
            <div className="w-full h-full">
                {children}
            </div>
        </div>
    )
}

export default Layout 