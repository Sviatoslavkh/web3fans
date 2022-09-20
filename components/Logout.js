import { PlusIcon } from '@heroicons/react/solid'
import { useState } from 'react';
import { useMoralis} from "react-moralis"
import { useRouter } from 'next/router'




export default function Lougout() {

  const router = useRouter()


    function logoutF(e){
      e.preventDefault();
      router.push('/logout')
    }

    return (

        <div className='place-self-center'>
          <button
            type="button"
            className="inline-flex items-center rounded border border-transparent bg-blue-100 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"        onClick={logoutF}
          >
            Logout
          </button>
        </div>

    )


}