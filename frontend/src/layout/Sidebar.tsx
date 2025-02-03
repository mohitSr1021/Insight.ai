import { useState, useEffect } from 'react'
import { Home, Star, MenuIcon, X } from 'lucide-react'
import { Menu } from "antd"
import type { MenuProps } from "antd"

const items: MenuProps["items"] = [
    {
        key: "home",
        icon: <Home size={18} />,
        label: "Home",
    },
    {
        key: "favorites",
        icon: <Star size={18} />,
        label: "Favourites",
    },
]

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768) // Adjust this breakpoint as needed
        }

        checkIsMobile()
        window.addEventListener('resize', checkIsMobile)

        return () => {
            window.removeEventListener('resize', checkIsMobile)
        }
    }, [])

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 bg-indigo-500 text-white rounded-full shadow-lg"
                    aria-label="Toggle Sidebar"
                >
                    {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </button>
            )}
            <div
                className={`
                    ${isMobile
                        ? 'fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out transform'
                        : 'relative'
                    }
                    ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
                    w-60 border rounded-2xl border-gray-300 bg-gray-50
                    ${isMobile ? 'h-full' : 'h-[calc(100vh-88px)]'}
                `}
            >
                <Menu
                    mode="inline"
                    defaultSelectedKeys={["home"]}
                    items={items}
                    className="border-0 rounded-2xl h-full"
                />
            </div>
        </>
    )
}

export default Sidebar
