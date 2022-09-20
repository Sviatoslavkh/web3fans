import React, { useState, useEffect } from 'react';
import Navigation from 'components/Navigation';
import { useMoralis, useChain, useWeb3Contract, useMoralisFile} from "react-moralis"
import { useRouter } from 'next/router'
import ErrorModal from 'components/ErrorModal'
import mainContract from 'constants/Main.json'
import SwitchNetworkModal from 'components/SwitchNetworkModal';
import TransactionModal from 'components/TransactionModal'

export default function New() {

    const router = useRouter()
    const { isAuthenticated, chainId, isWeb3Enabled, enableWeb3, user } = useMoralis()
    const {
      error,
      isUploading,
      moralisFile,
      saveFile,
    } = useMoralisFile();
    const { runContractFunction } = useWeb3Contract()
    const contractABI = mainContract.abi
    const contractAddress = mainContract.address
    let [transactionModalOpen, setTransactionModalOpen] = useState(false);
    let [loading, setLoaded] = useState(true);
    let [imageUrl, setImageUrl] = useState('');
    let [creatorName, setCreatorName] = useState(null);
    let [creatorDescription, setCreatorDescription] = useState(null);
    let [subscriptionPrice, setSubscriptionPrice] = useState(null);
    let [formIsReady, setFormIsReady] = useState(false);
  
    let handleFileChange = async file => {
      saveFile(file.name, file, { saveIPFS: true })
    };

    let handleNameChange = (event) =>{
        setCreatorName(event.target.value);
      }

    let handleDescriptionChange = (event) =>{
        setCreatorDescription(event.target.value);
      }
    

    let handlePriceChange = (event) =>{
        setSubscriptionPrice(parseInt(event.target.value));
        
      }
    
    let hundleRegistration = async (tx) =>{
        await tx.wait(1);
        let address = await user.get("ethAddress")
        router.push(`/creators/${address}`)
    }

    let handleSubmit = async (event) =>{
        event.preventDefault();
        if(creatorName && creatorDescription && imageUrl.length>0 && !isNaN(parseInt(subscriptionPrice)) && subscriptionPrice>=0){
            setTransactionModalOpen(true)
            await runContractFunction({
                    params: {
                    abi: contractABI,
                    contractAddress: contractAddress,
                    functionName: "registerAsCreator",
                    params: {
                        _name: creatorName,
                        _description: creatorDescription,
                        _avatar: imageUrl,
                        _subscriptionPrice: subscriptionPrice
                    }
                    },
                    onSuccess: hundleRegistration,
                    onError: (error) => {
                        console.log(error)
                        setTransactionModalOpen(false)
                    },
                })
          }
        
      }


    

    useEffect(() => {
      
      setLoaded(false)
  
      if(!loading){
        if(!isAuthenticated){
           router.push('/login')
         }else if(moralisFile != null && moralisFile != undefined){
          if(moralisFile['_ipfs']){
            if(moralisFile['_ipfs'] != imageUrl){
              setImageUrl(moralisFile['_ipfs'])
            }
          }
        }
         //switchNetwork("0x4")
         if(!isWeb3Enabled){
          enableWeb3()
         }
      }  
      if(creatorName && creatorDescription && imageUrl.length>0 && !isNaN(parseInt(subscriptionPrice)) && subscriptionPrice>=0){
        setFormIsReady(true)
      }else{
        setFormIsReady(false)
      }

    });

    

  return (

    <div className="min-h-full">
    <ErrorModal/>
    <SwitchNetworkModal/>
    <TransactionModal open={transactionModalOpen}/>
    <Navigation authrizationComplete={true} navLinks={[
        { name: 'Creators', href: '/creators', current: false },
        { name: 'New', href: '/creators/new', current: true }
          ]}/>
    <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <form className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>

          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Name
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                    onChange={handleNameChange}
                  />
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Description
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  defaultValue={''}
                  onChange={handleDescriptionChange}
                />
                <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                Photo
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <span className="rounded-full overflow-hidden bg-gray-100">
                    <img className="h-12 w-12 object-cover" src={imageUrl}/>
                  </span>
                  <FileInput onChange={handleFileChange} />
                  <button
                    type="button"
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={openFileDialog}
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Subscription price (per month)
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md ">
                
                <div>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                            type="text"
                            name="price"
                            id="price"
                            className={isNaN(parseInt(subscriptionPrice)) == true 
                                        ? "border-red-500 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm rounded-md" 
                                        : "focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"}
                            placeholder="0"
                            onChange={handlePriceChange}
                            />
                            
                        </div>
                        {isNaN(parseInt(subscriptionPrice)) == true ? <p className="text-red-500 text-xs italic">Please choose a password.</p> : ''}
                        </div>
                </div>
              </div>
            </div>
            

            
          </div>
        </div>

        
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Clear
          </button>
          <button
            type="submit"
            className=" disabled:opacity-20 ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={!formIsReady}
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </form>
            
  
          </div>
        </main>
      </div>
    </div>

  )
}