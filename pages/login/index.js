import React, { useState, useEffect } from 'react';
import Navigation from 'components/Navigation';
import ConnectWallet from 'components/ConnectWallet'
import { useMoralis} from "react-moralis"
import { useRouter } from 'next/router'



export default function Login() {

    const router = useRouter()
    const [loading, setLoaded] = useState(true);

    const { isAuthenticated } = useMoralis()


    useEffect( () => {
      
      setLoaded(false)
  
      if(!loading){
        if(isAuthenticated){
          router.push('/creators')
         }
      }  
    });
    

  return (

      <div className="min-h-full">
        <Navigation authrizationComplete={false} navLinks={[
        { name: 'Login', href: '/login', current: true }
          ]}/>
        <div className="py-10">
            <main>
              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Replace with your content */}

                <ConnectWallet/>
                {/* /End replace */}
              </div>
            </main>
          </div>
        </div>

  )
}
