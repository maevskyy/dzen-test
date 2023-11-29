import React, { useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';

type Props = {};

const CreateCommentForm = (props: Props) => {

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        text: '',
    })

    const dataHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setUserData(prev => ({
            ...prev,
            [name]: value
        }))
    }   

	return (
		<form className='flex flex-col gap-3'>
			<div className='w-full bg-[#f5f6f7] flex items-center justify-between py-2 px-4'>
				<div className='flex items-center justify-center gap-4'>
					<FaRegUserCircle className='w-[50px] h-[50px]' />
					<input
						type='text'
                        name='name'
                        value={userData.name}
                        onChange={dataHandler}
						className='px-3 py-1 rounded-sm text-lg outline-none'
						placeholder='Enter your name'
					/>
					<input
						type='email'
                        name='email'
                        value={userData.email}
                        onChange={dataHandler}
						className='px-3 py-1 rounded-sm text-lg outline-none'
						placeholder='Enter your email'
					/>
				</div>
                <div className="">Attach file</div>
			</div>
			<textarea
				name=''
				id=''
				placeholder='Type your thoughts..'
				className='min-h-[6em] resize-none w-full outline-none mt-2'
			></textarea>
            <div className="border-t flex items justify-end ">
			<div className=' flex gap-3 items-center pt-3'>
				<div className='w-[10em] h-[5em] border'>Captha</div>
				<button className='bg-[#f5f6f7] px-4 py-2 rounded-md hover:cursor-pointer hover:opacity-70 transition-opacity'>
					Close
				</button>
				<button className='border px-4 py-2 rounded-md hover:cursor-pointer hover:opacity-70 transition-opacity'>
					Add
				</button>
			</div>
            </div>
		</form>
	);
};

export default CreateCommentForm;
