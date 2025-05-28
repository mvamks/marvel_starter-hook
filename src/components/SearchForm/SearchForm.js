import  { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './searchForm.scss';
import useMyMarvelService from '../../services/MyMarvelService';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';


const SearchForm = () => {
    const [char, setChar] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const {getCharacterByName, clearError} = useMyMarvelService();

    return (
    <Formik
      initialValues={{
        name: '',
      }}
      validateOnBlur={true}
      validateOnChange={true}
      onSubmit={(values, { setSubmitting }) => {
        console.log('Форма отправлена с:', values); 
        clearError();
        const searchName = values.name.trim().toLowerCase();
        getCharacterByName(searchName)
          .then(res => {
            const filtred = res.filter(char => char.name.trim().toLowerCase().includes(searchName) );
            if (filtred.length > 0) {
              setChar(filtred); // сохраняем всех найденных
              setError(null);
              setSuccess(`There is! Visit ${filtred[0].name} page?`);
            } else {
                setChar([]);
                setError('The character was not found. Check the name and try again');
                setSuccess(null);
            }
          })
          .catch(() => {
            setChar([]);
            setError('This field is required');
            setSuccess(null);
          })
          .finally(() => setSubmitting(false));
      }}

      

      validate={values => {
        const errors = {};
        if (!values.name) {
          errors.name = 'This field is required';
        }
        return errors;
      }}
 
    >
      
      {({ isSubmitting, values, handleChange }) =>  (
          <div className='search-form'>
            <Form>
                <label htmlFor="name">Or find a character by name:</label>
                <Field 
                  type="text" 
                  id="name" 
                  name="name"
                  placeholder="Enter name" 
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value.trim() === '') {
                      setSuccess(null);
                      setError(null);
                    }
                  }} 
                />
                
                <button 
                  className="button button__main" 
                  type="submit" 
                  disabled={isSubmitting}>
                  <div className="inner">FIND</div>
                </button>
                <ErrorMessage name="name" component="div" className="error" />


                <TransitionGroup>
                  {/* Показываем success-сообщение, если есть */}
                    {success && char.length > 0 && (
                      <CSSTransition key="success"
                                     timeout={300}
                                     classNames="fade-succes"
                      >
                        <div className="success">
                          {success}
                          <Link to={`/characters/${char[0].id}`}>
                            <button 
                              className="button button__secondary" 
                              type="button"  // важно! иначе форма снова отправится
                            >
                              <div className="inner">TO PAGE</div>
                            </button>
                          </Link>
                        </div>
                      </CSSTransition>
                      
                    )}
                    
                    {/* Можно также показать ошибку от поиска */}
                    {error && (
                      <CSSTransition
                        key="error"
                        timeout={300}
                        classNames="fade-error"
                      >
                        <div className="error">{error}</div>
                      </CSSTransition>
                    )}  
                </TransitionGroup>
                      
            </Form>
          </div>    
        )}
    </Formik>
  );
};

export default SearchForm;
