import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";


const Page404 = () => {
    const someObject = "404 Not Found";
    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content='Error page'
                />
                <title>{someObject}</title>
            </Helmet>
            <div>
                <ErrorMessage/>
                <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>Page doesn't exist</p>
                <Link 
                    style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px'}} 
                    to="/" >Back to main page</Link>
            </div>
        </>
        
    )
}

export default Page404;