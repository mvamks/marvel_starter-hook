import { useState } from "react";
import { Helmet } from "react-helmet";

import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";


const ComicsPage = () => {
    const [selectedComics, setSelectadComics] = useState(null);
        
       /*  state = {
            selectedChar: null
        } */
    const onComicsSelected = (id) => {
        setSelectadComics(id);
        
        /* this.setState({
            selectedChar: id
        }) */
    }

    return(
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Page with list our comics"
                />
                <title>Comics page</title>
            </Helmet>
            <AppBanner/>
            <ComicsList onComicsSelected={onComicsSelected}
                        selectedComicsId={selectedComics} />
        </>
    )
}
export default ComicsPage;