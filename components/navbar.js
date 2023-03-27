import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';
import Image from 'next/image';

import { useSession, signIn, signOut } from "next-auth/react";
// import { authOptions } from './api/auth/[...nextauth]'
import { getServerSession } from "next-auth";
import AddPost from './addpost';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar(props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { data: session } = useSession()

  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">OnlyPuns</span>
            <Image width={20} height={20} className="h-8 w-auto" src="/onlypuns.png" alt="OnlyPuns logo" />
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
       
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {session ? (
            <>
              <AddPost session={session} addPost={props.addPost}/>
             <Popover.Group className="hidden lg:flex lg:gap-x-12 items-center">
              <Popover className="relative flex items-center justify-center">
                <Popover.Button
                  type='button'
                  className="-m-1.5 p-1.5"
                  aria-expanded="false">
                  <span className="sr-only">Profile Photo</span>
                  <Image width={50} height={50} className="h-10 w-auto rounded-full flex items-center justify-center" src={session?.user.image} alt="OnlyPuns logo" />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1">

                  <div class="absolute -left-8 top-full z-10 mt-3 w-max overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                    <div class="p-4">
                      <div class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
                        <div class="flex-auto">
                          <Link href="/puns" class="block font-semibold text-gray-900">
                            Home
                            <span class="absolute inset-0"></span>
                          </Link>
                        </div>
                     </div>
                     <div class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
                      <div class="flex-auto">
                        <div class="block font-semibold text-gray-900"
                          onClick={() => signOut()}>
                          Log Out
                          <span class="absolute inset-0"></span>
                        </div>
                      </div>
                     </div>    
                    </div>
                  </div>
                </Transition>
              </Popover>
            </Popover.Group>
            </>
          ) : (
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1">
              <span className="sr-only">About</span>
              <Image width={20} height={20}
                className="h-8 w-auto"
                src={session?.user.image}
                alt="Profile Photo"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  href="/puns"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  About
                </Link>
              </div>
              <div className="py-6">
                <Link
                  href="/login"
                  className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // if (!session) {
  //   //redirect to login page
  //   return {
  //     redirect: {
  //       destination: "/puns",
  //       permanent: false,
  //     },
  //   }
  // }

  return {
    props: {
      session,
    },
  }
}
