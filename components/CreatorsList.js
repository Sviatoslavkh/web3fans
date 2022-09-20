import React, { useState, useEffect } from 'react';
import CreatorRowInAList from 'components/CreatorRowInAList'


export default function CreatorsList(props) {


    return (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="table-fixed min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:invisible md:invisible lg:visible xl:visible 2xlvisible">
                        Description
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Subscription
                      </th>
                      <th scope="col" className="px-3 py-3.5 pr-4 sm:pr-6 text-left text-sm font-semibold text-gray-900 text-right">
                        Link
                      </th>
                    </tr>
                  </thead>
                  <tbody  className="divide-y divide-gray-200 bg-white">
                    {props.creatorsAddresses.map((address) => (
                      <CreatorRowInAList key={address} creatorAddress={address}/>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>


    )


}
