import React from 'react';
import { IoIosSearch } from 'react-icons/io';
import Select from 'react-select';

type Props = {};

const Filter = (props: Props) => {
	const options = [
		{ value: 'userName', label: 'By name' },
		{ value: 'email', label: 'By email' },
		{ value: 'date', label: 'By date' },
	];

	return (
		<Select
			options={options}
			placeholder={'Filter'}
			className=' hover:border-transparent w-[8em]'
		/>
	);
};

export default Filter;
