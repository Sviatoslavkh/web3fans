import { Disclosure } from '@headlessui/react'

import { HomeIcon } from '@heroicons/react/solid'
import Logout from 'components/Logout'

const pages = [
  { name: 'Projects', href: '#', current: false },
  { name: 'Project Nero', href: '#', current: true },
]


export default function Navigation(props) {


    return (
      <div>
        <Disclosure as="nav" className="bg-white border-b border-gray-200">

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      <h2 className="text-3xl font-bold leading-tight text-gray-900">Web3 Fans</h2>
                    </div>
                  </div>
                  {props.authrizationComplete ? <Logout/> : ''}
                </div>
                
                </div>
                
                
        </Disclosure>
        <nav className="bg-white border-b border-gray-200 flex" aria-label="Breadcrumb">
        <ol role="list" className="max-w-screen-xl w-full mx-auto px-4 flex space-x-4 sm:px-6 lg:px-8">
          <li className="flex">
            <div className="flex items-center">
              <a href="/creators" className="text-gray-400 hover:text-gray-500">
                <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </a>
            </div>
          </li>
          {props.navLinks.map((page) => (
            <li key={page.name} className="flex">
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 w-6 h-full text-gray-200"
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>
                <a
                  href={page.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  aria-current={page.current ? 'page' : undefined}
                >
                  {page.name}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </nav>
      </div>

    )


}
