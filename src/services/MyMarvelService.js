import { useHttp } from '../hooks/http.hook';

//const md5 = require('blueimp-md5');


const useMyMarvelService = () => {
    const { loading, request, error, clearError } = useHttp();

    const _apiBase = 'https://marvel-server-zeta.vercel.app/';
    // ЗДЕСЬ БУДЕТ ВАШ КЛЮЧ, ЭТОТ КЛЮЧ МОЖЕТ НЕ РАБОТАТЬ
    const _apiKey = 'd4eecb0c66dedbfae4eab45d312fc1df';
    
    const _baseOffset = 0;
    
        
    const getAllCharacters = async (offset = _baseOffset) => {

        const url = `${_apiBase}characters?limit=6&offset=${offset}&apikey=${_apiKey}`
        console.log('Отправляю запрос на всех персонажей:', url);

        const res = await request(url);
        console.log('✅ Ответ от getAllCharacters:', res);
       
        // Если в ответе есть поле error — персонаж не найден
        if (res.error) {
            console.warn('⚠️ Персонаж не найден');
            return null;
        }
        return res.data.results.map(_transformCharacter);   
    }
    
    const getComics = async (offset = 0) => {
        
        const url = `${_apiBase}comics?limit=8&offset=${offset}&apikey=${_apiKey}`;
        console.log('Отправляю запрос на комиксы:', url);

        const res = await request(url);
        console.log("Ответ от getComics:", res);
       
        return res.data.results.map(_transformComics);
        //return res.data;  
    }

    const getComic = async (id) => {
        
        const url = `${_apiBase}comics/${id}?apikey=${_apiKey}`;
        console.log("ЗАПРОС ОДНОГО КОМИКСА:", url);
    
        const res = await request(url);
        console.log('✅ Ответ от getComic:', res);
        return _transformComics(res.data.results[0]);
    }

    const getCharacter = async (id) => {
        const url = `${_apiBase}characters/${id}?apikey=${_apiKey}`;
       
        const res = await request(url);
        const charData = res?.data?.results?.[0];

        if (!charData) {
            
            return null; // или выброси ошибку, или верни объект-заглушку
        }
        
        return _transformCharacter(charData);   
    }

    const getCharacterByName = async (name) => {
        
            const url = `${_apiBase}characters?nameStartsWith=${name}&apikey=${_apiKey}`;
            const res = await request(url);

            if (!res.data || !res.data.results || res.data.results.length === 0) {
                return [];
            }

            console.log('✅имя:', res);
            return res.data.results.map(_transformCharacter);  
    }


    const _transformCharacter = (char) => {
        if(!char.description) {
            char.description = 'There is no character description at the moment.'
        }
        if(char.description.length > 220) {
            char.description = char.description.slice(0, 215) + '...';
        }
        let comics = char.comics.items || [];
        /* if (comics.length === 0) {
            comics = [{name: 'There are no comics for this character at the moment.'}];
        } */
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
            price: comics.prices?.[0]?.price
                ? `${comics.prices[0].price}$`
                : "not available",
        };
    }

    return {loading, error, getAllCharacters, getCharacter, clearError, getComics, getComic, getCharacterByName}
}


 export default useMyMarvelService;


 

