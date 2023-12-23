import { footerLinks } from '@/constants'
import { INavLink } from '@/types'
import React from 'react'
import { Link} from 'react-router-dom'

const Footer = () => {

    return (
        <section className='footer'>
                {footerLinks.map((link: INavLink) => {
                    return (
                        <Link to={link.route} key={link.label}>
                            <p className='tiny-medium text-black'>{link.label}</p>
                        </Link>
                    )
                })}
        </section>
    )
}

export default Footer