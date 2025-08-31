import React from 'react'
import LeftHome from '../component/LeftHome'
import Feed from '../component/Feed'
import RightHome from '../component/RightHome'

function Home() {
    return (
        <div className='w-full flex justify-center items-center'>


            <LeftHome />
            <Feed />
            <RightHome />

        </div>
    )
}

export default Home
