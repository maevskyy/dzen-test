import React from 'react'
import Filter from './Filter'

type Props = {}

const TheHeader = (props: Props) => {
  return (
    <header className='border-b px-10 py-7 flex justify-between items-center'>
        <h1 className='font-bold text-4xl'>Maevskiy</h1>
        <div className="flex gap-2">
            <Filter/>
        </div>
    </header>
  )
}

export default TheHeader