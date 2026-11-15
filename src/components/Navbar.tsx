'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession ,signOut} from 'next-auth/react'
import {User} from 'next-auth'
import { Button, buttonVariants } from '@/components/ui/button'

function Navbar() {
const {data:session} = useSession()
const pathname = usePathname()

const user:User =session?.user as User

    if (pathname.startsWith('/u/')) return null
    if (pathname.startsWith('/dashboard')) return null

    return (
        <>
        <nav className='p-4 md:p-6 shadow-md md:flex-row 
        justify-between items-center'>
            <div>
                <a  className ='text-xl font-bold mb-4 md:mb-0' href="#">Mystery message</a>
                {
                session?(
                    <>
                    <span className='mr-4'>Welcome ,{user?.username|| user?.email}</span>
                    <Button className='w-full md:w-auto' onClick={()=>signOut({callbackUrl:'/'})}>Logout</Button></>
                ):(<Link href="/sign-in" className={buttonVariants({ className: 'w-full md:w-auto' })}>Login</Link>)
            }
            </div>
        </nav>
        </>
    )
}

export default Navbar
