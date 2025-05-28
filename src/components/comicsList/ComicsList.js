import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useMyMarvelService from '../../services/MyMarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
//import aveng from '../../resources/img/Avengers.png';
//import avengLogo from '../../resources/img/Avengers_logo.png';


import './comicsList.scss';


const ComicsList = (props) => {
    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);


    const {getComics, loading, error} = useMyMarvelService();
    
    //. Функция запроса комиксов

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getComics(offset)
        .then(newComicsList => onComicsListLoaded(newComicsList, offset));
    };

    // Первоначальная загрузка данных (useEffect)

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    //Функция обновления данных (onComicsListLoaded)

    const onComicsListLoaded = (newComicsList, newOffset) => {
        setComicsList(prevComicsList => {
            const ids = new Set(prevComicsList.map(item => item.id));
            const filtredNew = newComicsList.filter(item => !ids.has(item.id));
            return [...prevComicsList, ...filtredNew];
        });
        
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setNewItemLoading(false);
        setOffset(newOffset + 8);
        setComicsEnded(ended);
    };



// Рендер списка комиксов (renderItems)
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            
            
            return (
                <li 
                    className="comics__item"
                    key={item.id}
                    onClick={() => {props.onComicsSelected(item.id)}}> 
                        <Link to={`/comics/${item.id}`}>
                            <img className="comics__item-img" src={item.thumbnail} alt={item.title} />
                            <div className="comics__item-title">{item.title}</div>
                            <div className="comics__item-price">{item.price}</div>
                        </Link>
                    
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    };

    const items = renderItems(comicsList);
    console.log('items:', items);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <>
       {/*  <div className="comics__banner">
            <img src={aveng} alt="avengers" className="comics__banner-img"/>
            <div className="comics__banner-descr">New comics every week! Stay tuned!</div>
            <img src={avengLogo} alt="avengers-logo" className="comics__banner-logo"/>
        </div> */}
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">Load more</div>
            </button>
        </div>
        </>
    );
};

ComicsList.propTypes = {
    onComicsSelected: PropTypes.func.isRequired
};

export default ComicsList;