import './scrollToTopButton.scss';
import arrowIcon  from '../../resources/img/top.png';

import { Component } from 'react';

class ScrollToTopButton  extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isVisible: false
        };
    }

    handleScroll = () => {
        // Проверяем, насколько прокручена страница
        if(window.pageYOffset > window.innerHeight) {
            this.setState({isVisible: true});
        } else {
            this.setState({isVisible: false});
        }
    };

    scrollToTop = () => {
         // Прокручиваем страницу наверх с плавной анимацией
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    componentDidMount() {
         // Добавляем обработчик события прокрутки
         window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        let button = null;
        if(this.state.isVisible) {
           button = (
                <button onClick={this.scrollToTop}>
                    <img className='button-top__img' 
                         src={arrowIcon} 
                         alt="Scroll to top" />
                </button> 
            );
        }
        return (
            <div className='button-top'>
                {button}
            </div>
        );
    }
}

export default ScrollToTopButton;