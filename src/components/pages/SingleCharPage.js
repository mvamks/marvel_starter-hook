import { useParams, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import useMyMarvelService from '../../services/MyMarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './singleCharPage.scss';
import AppBanner from '../appBanner/AppBanner';



const SingleCharPage = () => {
    const { charId } = useParams();
    const location = useLocation(); // Получаем текущий путь
    console.log('location:', location);
    console.log('Comic ID:', charId); 
    const [char, setChar] = useState(null); //данные о комиксе 
    const { loading, error, clearError, getCharacter} = useMyMarvelService();
    
    
    useEffect(() => {
        updateChar();
    }, [charId]);

    

    const updateChar= () => {
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        console.log('Загруженный персонаж:', char);
        setChar(char); 
    }
    
   

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char} location={location}/> : null;

    return (
        <>
            
            {errorMessage}
            {spinner}
            {content} 
        </>
    )
    
}

const View = ({char, location}) => {
    const {name, description, thumbnail } = char;
    const backLink = location?.state?.from || '/'; 
    console.log('backLink:', backLink);

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content={`${name} character`}
                />
                <title>{name}</title>
            </Helmet>
            <AppBanner/>
            <div className="single-char">
                <img src={thumbnail} alt={name} className="single-char__img"/>
                <div className="single-char__info">
                    <h2 className="single-char__name">{name}</h2>
                    <p className="single-char__descr">{description}</p>
                    
                </div>
                <Link to={ backLink } className="single-char__back">Back to all</Link>
            </div>
        </>
        
    )
}

export default SingleCharPage;