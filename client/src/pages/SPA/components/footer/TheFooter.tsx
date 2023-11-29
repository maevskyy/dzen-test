import { FaCaretLeft, FaCaretRight } from 'react-icons/fa6';

type Props = {};

const TheFooter = (props: Props) => {
	const pages = ['1', '2', '3'];

	return (
		<footer className='m-auto flex  items-center gap-3 mt-5 mb-10'>
			<FaCaretLeft />
			<ul className='flex gap-3'>
				{pages.map((el) => (
					<li
						className={`w-[2em] h-[2em] border flex items-center justify-center rounded-md
                        ${(el === '1') ? 'bg-black text-white' : ''}`}
					>
						<a
							href=''
							className='font-semibold '
						>
							{el}
						</a>
					</li>
				))}
			</ul>
			<FaCaretRight />
		</footer>
	);
};

export default TheFooter;
