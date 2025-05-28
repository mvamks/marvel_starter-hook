import { useParams, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import useMyMarvelService from '../../services/MyMarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './singleComicPage.scss';
import AppBanner from '../appBanner/AppBanner';



const SingleComicPage = () => {
    const { comicId } = useParams();
    const location = useLocation(); // Получаем текущий путь
    console.log('location:', location);
    console.log('Comic ID:', comicId); 
    const [comic, setComic] = useState(null); //данные о комиксе 
    const { loading, error, clearError, getComic} = useMyMarvelService();
    
    
    useEffect(() => {
        updateComic();
    }, [comicId]);

    

    const updateComic= () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded)
    }

    const onComicLoaded = (comic) => {
        console.log('Загруженный персонаж:', comic);
        setComic(comic); 
    }
    
   

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic} location={location}/> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content} 
        </>
    )
    
}

const View = ({comic, location}) => {
    const {title, description, pageCount, thumbnail, language, price} = comic;
    const backLink = location?.state?.from || '/'; 
    console.log('backLink:', backLink);

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content={`${title} comics book`}
                />
                <title>{title}</title>
            </Helmet>
            <AppBanner/>
            <div className="single-comic">
                <img src={thumbnail} alt={title} className="single-comic__img"/>
                <div className="single-comic__info">
                    <h2 className="single-comic__name">{title}</h2>
                    <p className="single-comic__descr">{description}</p>
                    <p className="single-comic__descr">{pageCount}</p>
                    <p className="single-comic__descr">Language: {language}</p>
                    <div className="single-comic__price">{price}</div>
                </div>
                <Link to={ backLink } className="single-comic__back">Back to all</Link>
            </div>
        </>
        
    )
}

export default SingleComicPage;