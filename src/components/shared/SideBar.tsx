import { sidebarLinks } from "@/constants"
import { useUserContext } from "@/context/AuthContext"
import { INavLink } from "@/types"
import { Link, useLocation } from "react-router-dom"

const SideBar = () => {
    const {user} = useUserContext()
    const {pathname} = useLocation()

    return (
        <section className="leftsidebar  border-r-2 border-r-gray-400">
            <div className="flex flex-col gap-11">
                <div className="flex gap-2 flex-center">
                    <img
                        src={user.imageUrl || ''}
                        className="h-14 w-14 rounded-full"
                    />
                    <div>
                        <p className="h3-bold">{user.username}</p>
                        <p className="text-grey text-sm">{user.email}</p>
                    </div>
                </div>

                {sidebarLinks.map((link: INavLink) => {
                    const isActive = pathname === ( `/nook/${user.id}` + link.route )

                    return (
                        <Link className={`flex gap-3 items-center p-6 rounded-md hover:underline ${isActive && 'bg-complement'}`} to={`/nook/${user.id}` + link.route} key={link.label}>
                            {link.label}
                        </Link>
                    )
                })}

            </div>
        </section>
    )
}

export default SideBar