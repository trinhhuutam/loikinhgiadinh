import siteMetadata from '../utils/siteMetadata'
import headerNavLinks from '../utils/headerNavLinks'
import Logo from '../utils/logo.svg'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="flex items-center justify-between py-10">
      <div>
         <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
             {/*  <Logo /> */}
            </div>
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            

          </div>
        </Link> 
      </div>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        {headerNavLinks
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hidden font-medium  sm:block"
            >
              {link.title}
            </Link>
          ))}
        {/* <SearchButton /> */}
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
