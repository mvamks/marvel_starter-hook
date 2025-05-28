import { useState, useEffect, useRef } from 'react';
import {TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import useMyMarvelService from '../../services/MyMarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { Link } from 'react-router-dom';


import './charList.scss';


const CharList = (props) =>  {
    const [charList, setCharList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);

    /* state = {
        characters: [],
        loading: true,
        error: false,
        offset: 210, 
        newItemLoading: false, //Флаг загрузки новых персонажей
        charEnded: false
    }; */

    const {loading, error, getAllCharacters} = useMyMarvelService();
    
    const onRequest = (newOffset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        
        getAllCharacters(newOffset)
            .then(onCharListLoaded );
    };


    useEffect(() => {
        onRequest(offset);
    }, []);

    useEffect(() => {
        const onLoadByScroll = () => {
            if (loading || charEnded || newItemLoading) return; // Если уже загружается - не вызываем снова
    
            let scrollHeight = Math.max(
                document.documentElement.scrollHeight, 
                document.body.scrollHeight
            );
            if(
                Math.floor(window.scrollY + document.documentElement.clientHeight) >= scrollHeight
            ) {
                setNewItemLoading(true); // Устанавливаем флаг загрузки
                setOffset(prevOffset => {
                    const nextOffset = prevOffset + 9;
                    onRequest(nextOffset, false);
                    return nextOffset;
                });      
            } 
        };

        window.addEventListener('scroll', onLoadByScroll);

        return () => {
            window.removeEventListener('scroll', onLoadByScroll);
        };

    }, [loading, charEnded, newItemLoading, onRequest]);

    
    
    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 6) {
            ended = true;
        }

        setCharList(prevCharList => {
            const ids = new Set(prevCharList.map(item => item.id));
            const filtredNew = newCharList.filter(item => !ids.has(item.id));
            return [...prevCharList, ...filtredNew];
        });

        setNewItemLoading(false);
        setOffset(prevOffset => prevOffset + 9);
        setCharEnded(ended);
    }
    
       
    const itemRefs = useRef([]);
    
    const focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }
    
    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render

    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = { 'objectFit' : 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit' : 'unset' };
            }
            
            return (
                <CSSTransition 
                    key={item.id} 
                    timeout={700} 
                    classNames="char__item" 
                >
                    <li 
                        className="char__item"
                        tabIndex={0}
                        ref={(el) => itemRefs.current[i] = el}
                        //key={item.id}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                        <Link to={`/characters/${item.id}`}>
                            <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        </Link>
                            <div className="char__name">{item.name}</div>
                        
                            
                    </li>
                </CSSTransition>   
            );
        });
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup> 
            </ul>);  // Возвращаем результат маппинга  
    }
    
    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;