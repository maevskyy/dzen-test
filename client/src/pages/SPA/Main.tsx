import { useState } from 'react';
import TheHeader from './components/header/TheHeader';
import TheMain from './components/main/TheMain';
import TheFooter from './components/footer/TheFooter';
import CommentPopUp from './components/popUps/CommentPopUp';

const Main = () => {

    const [isCommentOpen, setIsCommentOpen] = useState(true)

	return (
		<div className='flex flex-col h-full'>
			<TheHeader />
			<TheMain setOpen={setIsCommentOpen} />
			<TheFooter />
            {isCommentOpen && <CommentPopUp setOpen={setIsCommentOpen}/>}
		</div>
	);
};

export default Main;
