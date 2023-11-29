//!fix types

type Props = {
	setOpen?: any;
	removeAnimation?: boolean;
};

const Comment = ({ setOpen, removeAnimation }: Props) => {
	return (
		<article
			className={`flex flex-col gap-3 ${
				removeAnimation
					? removeAnimation
					: '  hover:scale-[1.01] hover:cursor-default ease-in-out duration-300'
			}`}
			onClick={() => setOpen(true)}
		>
			<div className='w-full bg-[#f5f6f7] flex items-center justify-between py-2 px-4'>
				<div className='flex items-center justify-center gap-4'>
					<div className='w-[50px] h-[50px] bg-black rounded-full'></div>
					<h5 className='font-semibold text-lg'>Anonym</h5>
					<span>22.05.22 в 22:30</span>
					<div className='w-[24px] h-[24px] bg-black'></div>
					<div className='w-[24px] h-[24px] bg-black'></div>
					<div className='w-[24px] h-[24px] bg-black'></div>
					<div className='w-[24px] h-[24px] bg-black'></div>
				</div>
				<div className='flex items-center justify-center gap-4'>
					<div className='w-[24px] h-[24px] bg-black'></div>
					<span>0</span>
					<div className='w-[24px] h-[24px] bg-black'></div>
				</div>
			</div>
			<div className='text-sm text-gray-700 px-1'>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reprehenderit laboriosam
				at aut perspiciatis recusandae itaque voluptas dignissimos delectus mollitia
				deserunt incidunt illo, voluptates praesentium placeat fuga possimus dolor. Sequi
				qui quos non dolorum nostrum unde officiis eveniet autem molestias inventore!
				Accusantium iste deserunt voluptas ipsa voluptates illo ratione temporibus nihil.
			</div>
		</article>
	);
};

export default Comment;
