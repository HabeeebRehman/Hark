import React from 'react'
import { Button } from "@/components/ui/button"


function Navbar() {
    return (
        <div>
            <div className='navbar w-full h-15 bg-gray-400 flex justify-between items-center relative z-10' >
                <div className='logo'>
                    <img src="./assets/logo.png" alt="" />
                </div>
                <div className='r-3'>
                    <Button variant="ghost">Log Out</Button>

                </div>

            </div>
        </div>
    )
}

export default Navbar