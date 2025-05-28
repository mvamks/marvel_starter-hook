import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import useMyMarvelService from '../../services/MyMarvelService';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';


const CharInfo = ({charId, comicsList}) => {
    console.log('comicsList :', comicsList);
    
    const [char, setChar] = useState(null);
    const location =  useLocation();
    const {loading, error, getCharacter, clearError} = useMyMarvelService();
    

    /* state = {
        char: null,
        loading: false,
        error: false
    } */

    

    useEffect(() => {
        if(!charId) return;
        clearError();
        getCharacter(charId).then(setChar);
        
    }, [charId]);

    

    const skeleton =  !char && !loading && !error ? <Skeleton/> : null ;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char} comicsList={comicsList} location={location}/> : null;


    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}   
        </div>
        
    )      
}

const View = ({char, comicsList, location}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    console.log('Комиксы', comics);
    console.log('КомиксыЛист', comicsList);
     
    const isImageNotAvailable = thumbnail.includes('image_not_available');
    const imgStyle = isImageNotAvailable ? { objectFit: 'contain' } : { objectFit: 'cover' };
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt="{name}" style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                comics.length === 0 ? (
                    'There is no comics with this character' 
                ) : (
                    comics.slice(0, 10).map((comicName, i) => {
                        const matched = comicsList.find(
                            (comic) => comic.title.toLowerCase() === comicName.toLowerCase()
                        );
                        

                        return (
                            <li className="char__comics-item" key={i}>
                                {matched ? (
                                    <Link to={ `/comics/${matched.id}`}>
                                        {comicName}
                                    </Link>
                                ) : (
                                    comicName
                                )}  
                            </li>
                        );
                    })
                )}
            

                  {/*  : comics.map((item, i) => {
                         // eslint-disable-next-line
                        if (i >= 10 || !item?.resourceURI) return null; 
                        const comicId = item.resourceURI.split('/').pop();
                        
                        return (
                            <li className="char__comics-item" key={i}>
                                <Link to={{
                                    pathname: `/comics/${comicId}`,
                                    state: { from: location }, // передаем состояние с текущим путем
                                }}>
                                    {item.name}
                                </Link> 
                            </li> 
                        );     
                    )  */}
                              
            </ul>
        </>  
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number,
    comicsList: PropTypes.array,
};
CharInfo.defaultProps = {
    comicsList: [],
};

export default CharInfo;