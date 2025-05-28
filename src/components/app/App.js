import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import MainPage from '../pages/MainPage';

import Spinner from "../spinner/Spinner";

const Page404  = lazy(() => import('../pages/404'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() => import('../pages/SingleComicPage'));
const SingleCharPage = lazy(() => import('../pages/SingleCharPage'));
const ScrollToTopButton = lazy(() => import("../scrollToTopButton/ScrollToTopButton"));





const App = () => {
        
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <ScrollToTopButton/>
                            <Routes>
                                <Route path="/" element={<MainPage/>}/>
                                <Route path="/comics" element={<ComicsPage/>}/>
                                <Route path="/comics/:comicId" element={<SingleComicPage/>}/>
                                <Route path="/characters/:charId" element={<SingleCharPage/>}/>

                                <Route path="*" element={<Page404/>}/>
                            </Routes>
                    </Suspense>
                    
                </main>
            </div>
        </Router> 
    )   
}


export default App;