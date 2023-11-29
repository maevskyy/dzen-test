import React from 'react';
import Comment from '../main/components/Comment';

type Props = {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentPopUp = ({ setOpen }: Props) => {
	const dontClose = (e: React.MouseEvent) => e.stopPropagation();
	return (
		<div
			className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-md '
			onClick={() => setOpen(false)}
		>
			<div
				className='border rounded-sm flex flex-col shadow-xl h-full w-[800px] bg-white p-5 overflow-auto '
				onClick={dontClose}
			>
				<Comment removeAnimation />
				<div className='border-b border-black w-full h-[1px] mt-10'></div>
				<h4 className='my-3 text-lg'>Responses:</h4>
				<div className=' flex flex-col w-11/12  gap-5 m-auto '>
					{Array(100)
						.fill('')
						.map((el) => (
							<Comment removeAnimation />
						))}
				</div>
			</div>
		</div>
	);
};

export default CommentPopUp;
