import React, { useState, useEffect } from 'react';
import Navigation from 'components/Navigation';
import ConnectWallet from 'components/ConnectWallet'
import { useMoralis} from "react-moralis"
import { useRouter } from 'next/router'







export default function Home() {


  const router = useRouter()
  const [loading, setLoaded] = useState(true);
  const { user, isAuthenticated, isInitializing } = useMoralis()


  useEffect( () => {
      
    setLoaded(false)

    if(!loading){
      if(isAuthenticated){
        router.push('/creators')
       }else{
         router.push('/login')
       }
    }  
  });

    

  return (

      <div className="min-h-full">
        <Navigation/>
        <div className="py-10">
            <header>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
              </div>
            </header>
            <main>
              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Replace with your content */}

                
                {/* /End replace */}
              </div>
            </main>
          </div>
        </div>

  )
}
