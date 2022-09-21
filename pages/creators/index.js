import React, { useState, useEffect } from 'react';
import Navigation from 'components/Navigation';
import {Moralis} from 'moralis'
import { useMoralis, useChain, useWeb3Contract} from "react-moralis"
import { useRouter } from 'next/router'
import CreatorsList from 'components/CreatorsList'
import Loading from 'components/Loading';
import ErrorModal from 'components/ErrorModal'
import mainContract from 'constants/Main.json'
import SwitchNetworkModal from 'components/SwitchNetworkModal';

export default function Creators() {

  const router = useRouter()
  const [loading, setLoaded] = useState(true);
  const [creatorsAddresses, setCreatorsAddresses] = useState([]);
  const [creatorsLeft, setCreatorsLeft] = useState(undefined);
  const [nextCreatorIndex, setNextCreatorIndex] = useState(0);
  const [first, setfirst] = useState(true);
  const { isAuthenticated, chainId, isWeb3Enabled, enableWeb3 } = useMoralis()
  const { switchNetwork } = useChain();
  const contractABI = mainContract.abi
  const contractAddress = mainContract.address


    


    function hundleCreatorsAddresses(result){
      console.log(`addresses: ${result}`)
      /*let creatorsAddressesTmp = creatorsAddresses;
      for(let i=0; i<addresses.length; i++){
        if(!creatorsAddressesTmp.includes(addresses[i])){
          creatorsAddressesTmp.push(addresses[i]);
        }
      }
      setCreatorsAddresses(creatorsAddressesTmp);
      setCreatorsLeft(count);
      setNextCreatorIndex(next);*/

    }

    const { data, error, runContractFunction, isFetching, isLoading } =
        useWeb3Contract({
          abi: contractABI,
          contractAddress: contractAddress,
          functionName: "getCreatorsIDs",
          params: {
            _startIndex: nextCreatorIndex,
            _limit: 20
          },
        });

    const fetchCreatorsAddresses = async () => {
      console.log('start fetching')
      if(creatorsLeft !=0){
        await runContractFunction();
      }
      

    }


    const goToCreatorNew = () =>{

      router.push('/creators/new')
    }
    

    

    useEffect(() => {
      
      setLoaded(false)
  
      if(!loading){
        if(!isAuthenticated){
           router.push('/login')
         }
         //switchNetwork("0x4")
         if(!isWeb3Enabled){
          enableWeb3()
         }
         if(isWeb3Enabled && creatorsAddresses.length == 0 && first && !isLoading){
          fetchCreatorsAddresses()
          setfirst(false)
         }
         if(data != null){
          let creatorAddressesTmp = creatorsAddresses;
          for(let i =0; i < data[0].length; i++){
            if(!creatorsAddresses.includes(data[0][i])){
              creatorAddressesTmp.push(data[0][i])
            }
          }
          setCreatorsAddresses(creatorAddressesTmp)
          setCreatorsLeft(Moralis.Units.Token(data[1], "0"))
          setNextCreatorIndex(Moralis.Units.Token(data[2], "0"))
         }
      }  
    });

  return (

      <div className="min-h-full">
        <SwitchNetworkModal/>
        <ErrorModal/>
        <Navigation authrizationComplete={true} navLinks={[
        { name: 'Creators', href: '/creators', current: true }
          ]}/>
        <div className="py-10">
            <header>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
              </div>
            </header>
            <main>
              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Replace with your content */}
                <div className="px-4 sm:px-6 lg:px-8">
                  <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                    <h1 className="text-3xl font-bold leading-tight text-gray-900">Creators list</h1>
                      <p className="mt-2 text-sm text-gray-700">
                        A list of all creators to follow
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                        onClick={goToCreatorNew}
                      >
                        Register as a Cretor
                      </button>
                    </div>
                </div>
                <CreatorsList creatorsAddresses={creatorsAddresses}/>
                <nav
                    className="bg-white py-3 flex items-center justify-between border-t border-gray-200"
                    aria-label="Pagination"
                  >
                    <div className="hidden sm:block">
                     
                    </div>
                    <div className="flex-1 flex justify-between sm:justify-end">
                      <a
                        href="#"
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </a>
                      <a
                        href="#"
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Next
                      </a>
                    </div>
                </nav>
              </div>
                
      
              </div>
            </main>
          </div>
        </div>

  )
}