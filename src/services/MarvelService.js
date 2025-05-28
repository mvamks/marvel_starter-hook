import { useHttp } from '../hooks/http.hook';

const md5 = require('blueimp-md5');


const useMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();
    
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    // ЗДЕСЬ БУДЕТ ВАШ КЛЮЧ, ЭТОТ КЛЮЧ МОЖЕТ НЕ РАБОТАТЬ
    const _apiKey = '5612e8f1e5717d96da3d398dd24946bf';
    const _privateKey = '9bc1b7fb808836b7aa51dbbd4036c6e9055fdc33';
    const _baseOffset = 210;

    
    const getAllCharacters = async (offset = _baseOffset) => {
        const ts = Date.now();
        const hash = md5(ts + _privateKey + _apiKey);
        console.log("Generated hash:", hash);
        const url = `${_apiBase}characters?ts=${ts}&limit=9&offset=${offset}&apikey=${_apiKey}&hash=${hash}`
        console.log('Отправляю запрос char:', url);

        const res = await request(url);
        return res.data.results.map(_transformCharacter); 
    }
    
    const getComics = async (offset = 0) => {
        const ts = Date.now();
        const hash = md5(ts + _privateKey + _apiKey);
        console.log("Generated hash:", hash);
        const url = `${_apiBase}comics?ts=${ts}&limit=8&offset=${offset}&apikey=${_apiKey}&hash=${hash}`
        console.log('Отправляю запрос comics:', url);

        const res = await request(url);
        console.log("Данные о комиксах:", res.data.results);
        console.log("Общее количество персонажей в API:", res.data.total);
        return res.data.results.map(_transformComics);
        //return res.data;
        
    }

    const getComic = async (id) => {
        const ts = Date.now();
        const hash = md5(ts + _privateKey + _apiKey);
        const url = `${_apiBase}comics/${id}?ts=${ts}&apikey=${_apiKey}&hash=${hash}`;
        console.log("ЗАПРОС ОДНОГО КОМИКСА:", url);
    
        const res = await request(url);
        return _transformComics(res.data.results[0]);
    }

    const getCharacter = async (id) => {
        const url = `${_apiBase}characters/${id}?apikey=${_apiKey}`;
       
        const res = await request(url);
        return _transformCharacter(res.data.results[0]);   
    }

    const _transformCharacter = (char) => {
        if(!char.description) {
            char.description = 'There is no character description at the moment.'
        }
        if(char.description.length > 220) {
            char.description = char.description.slice(0, 215) + '...';
        }
        let comics = char.comics.items;
        if (comics.length === 0) {
            comics = [{name: 'There are no comics for this character at the moment.'}];
        }
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension ,
            homepage: char.urls[0].url || '#',
            wiki: char.urls[1].url || '#',
            comics: comics
        }
    }

    const _transformComics = (comics) => {
		return {
			id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			// optional chaining operator
			price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available",
		};
    }

    return {loading, error, getAllCharacters, getCharacter, clearError, getComics, getComic}
}


 export default useMarvelService;


 

