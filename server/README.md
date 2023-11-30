проблемы с txt файлами (если в них кирилица то амазон отдает текст в неправильны кодировке) на фронте их нужно будет принимать как-то вот так:
	useEffect(() => {
		fetch(
			'https://dmi-nfts-collection.s3.eu-north-1.amazonaws.com/photos/3ee33970-bf91-436c-91ea-3c7bfc155162-forcheck.txt'
		)
			.then((res) => res.text())
			.then((text) => {
				console.log(text, 'this is decoded text');
			})
			.catch((err) => console.log(err));
	}, []);