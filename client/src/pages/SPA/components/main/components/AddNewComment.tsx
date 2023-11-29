import { FcPlus } from 'react-icons/fc';

type Props = {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddNewComment = ({ setOpen }: Props) => {
	const cardStyles = `
    rounded-sm w-full flex
    items-center justify-center gap-2
    py-5 border-[2px] hover:scale-[1.01]
    hover:shadow-sm ease-in-out duration-200 border-[#f5f6f7]
    hover:cursor-pointer select-none
    `;

	return (
		<div className={cardStyles} onClick={() => setOpen(prev => !prev)}>
			<FcPlus />
			<span className='text-lg font-semibold'>Add new comment</span>
		</div>
	);
};

export default AddNewComment;
