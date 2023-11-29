import { useState } from 'react';

import AddNewComment from './components/AddNewComment';
import Comment from './components/Comment';
import CreateCommentForm from './components/CreateCommentForm';

type Props = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const TheMain = ({setOpen}: Props) => {
	const [isCreationFormOpen, setIsCreationFormOpen] = useState(false);

	return (
		<main className='flex flex-col h-full flex-1 p-10 gap-10'>
			<AddNewComment setOpen={setIsCreationFormOpen} />
			{isCreationFormOpen && <CreateCommentForm />}
			{Array(10)
				.fill('')
				.map((el) => (
					<Comment setOpen={setOpen} />
				))}
		</main>
	);
};

export default TheMain;
