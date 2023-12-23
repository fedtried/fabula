import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react"
import { useUserContext } from "@/context/AuthContext"

const Navbar = () => {
    const navigate = useNavigate()
    const {user} = useUserContext()
    const { mutate: signOut, isSuccess } = useSignOutAccount();

    useEffect(() => {
      if (isSuccess) navigate(0);
    }, [isSuccess]);

    return (
        <nav className="navbar flex flex-row justify-between px-10 drop-shadow-lg">
            <div className="flex-between py-4 px-5">
                <Link to='/' className="flex gap-3 items-center header-text text-lg">
                    Fabula
                </Link>
            </div>
            <div className="flex gap-4">
                <Button variant='ghost' className="button-ghost h-8" onClick={() => signOut()}>
                        <img className="w-4 h-4 " src="./assets/icons/logout.svg"/>
                </Button>
                <Link className="flex-center gap-3 h8" to={`/nook/${user.id}/writing`}>
                    <img
                        src={user.imageUrl || ''}
                        alt="profile photo"
                        className="w-8 h-8 rounded-full"
                    />
                    {user.username}
                </Link>
            </div>
        </nav>
    )
}

export default Navbar