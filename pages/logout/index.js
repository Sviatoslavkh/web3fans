import React, { useState, useEffect } from 'react';
import { useMoralis} from "react-moralis"
import { useRouter } from 'next/router'





export default function Lougout() {

  const router = useRouter()
  const { isAuthenticated, logout } = useMoralis();

  const [loading, setLoaded] = useState(true);

  useEffect( () => {
      
    setLoaded(false)

    if(!loading){
      if(isAuthenticated){
        logout().then(
            router.push('/login')
        )
       }
       
    }  
  });


    return (

        
        <div/>

    )


}