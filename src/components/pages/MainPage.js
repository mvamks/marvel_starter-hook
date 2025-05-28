import { useState, useEffect} from "react";
import { Helmet } from "react-helmet";
import useMyMarvelService from "../../services/MyMarvelService"; // не забудь импортировать
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import SearchForm from "../SearchForm/SearchForm";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import decoration from '../../resources/img/vision.png';


const MainPage = () => {
        const [selectedChar, setSelectadChar] = useState(1);
        const [comicsList, setComicsList] = useState([]);
        const { getComics } = useMyMarvelService();
            
       /*  state = {
            selectedChar: null
        } */
         useEffect(() => {
            getComics().then(setComicsList);
         }, []);

        const onCharSelected = (id) => {
            setSelectadChar(id);
            
            
            /* this.setState({
                selectedChar: id
            }) */
        }

    return (
        <>
        <Helmet>
            <meta
                name="description"
                content="Marvel information portal"
            />
            <title>Marvel information portal</title>
        </Helmet>
            <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onCharSelected={onCharSelected}/>
                </ErrorBoundary>
                <div className="right-column">
                    <ErrorBoundary>
                        <CharInfo charId={selectedChar} comicsList={comicsList}/>  
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <SearchForm/>   
                    </ErrorBoundary>
                </div>
                
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;