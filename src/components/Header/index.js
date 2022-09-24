import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {MdMenu} from 'react-icons/md'
import {AiOutlineClose} from 'react-icons/ai'
import {FiSun} from 'react-icons/fi'
import Cookies from 'js-cookie'
import BookHubThemeContext from '../../context/BookHubThemeContext'
import './index.css'

class Header extends Component {
  state = {isToggle: false}

  onClickCloseIcon = () => {
    this.setState(prevState => ({
      isToggle: !prevState.isToggle,
    }))
  }

  onClickMenuIcon = () => {
    this.setState(prevState => ({
      isToggle: !prevState.isToggle,
    }))
  }

  onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  render() {
    const {isToggle} = this.state
    return (
      <BookHubThemeContext.Consumer>
        {value => {
          const {isDarkTheme, onClickThemeIcon} = value

          const bgColor = isDarkTheme
            ? 'header-dark-theme'
            : 'header-light-theme'
          const textColor = !isDarkTheme
            ? 'light-theme-text'
            : 'dark-theme-text'

          const onClickThemeButton = () => {
            onClickThemeIcon()
          }

          return (
            <nav className={`navbar ${bgColor}`}>
              <div className={`header-responsive-navbar ${bgColor}`}>
                <Link to="/">
                  <img
                    src="https://res.cloudinary.com/dovk61e0h/image/upload/v1663608571/Bookhub/Group_7731Website_Logo_o1zltx_zndaus.png"
                    className="website-logo"
                    alt="website logo"
                  />
                </Link>

                <ul className="nav-items-container">
                  <Link to="/" className="nav-links">
                    <li className={`nav-text ${textColor}`}>Home</li>
                  </Link>
                  <Link to="/shelf" className="nav-links">
                    <li className={`nav-text ${textColor}`}>Bookshelves</li>
                  </Link>
                  <button
                    type="button"
                    onClick={onClickThemeButton}
                    className="theme-button"
                  >
                    <FiSun className={textColor} size={25} />
                  </button>
                  <Link to="/login" className="nav-links">
                    <li>
                      <button
                        type="button"
                        onClick={this.onClickLogout}
                        className="logout-button"
                      >
                        Logout
                      </button>
                    </li>
                  </Link>
                </ul>
                <button
                  type="button"
                  className="menu-icon"
                  onClick={this.onClickMenuIcon}
                >
                  <MdMenu className={textColor} size={20} />
                </button>
              </div>
              {isToggle && (
                <ul className="mobile-nav-items-container">
                  <Link to="/" className="nav-links">
                    <li className={`nav-text ${textColor}`}>Home</li>
                  </Link>
                  <Link to="/shelf" className="nav-links">
                    <li className={`nav-text ${textColor}`}>Bookshelves</li>
                  </Link>
                  <button
                    type="button"
                    onClick={onClickThemeButton}
                    className="theme-button"
                  >
                    <FiSun className={textColor} size={25} />
                  </button>
                  <Link to="/login" className="nav-links">
                    <li>
                      <button
                        type="button"
                        onClick={this.onClickLogout}
                        className="logout-button"
                      >
                        Logout
                      </button>
                    </li>
                  </Link>
                  <button
                    type="button"
                    className="close-icon"
                    onClick={this.onClickCloseIcon}
                  >
                    <AiOutlineClose className={textColor} size={20} />
                  </button>
                </ul>
              )}
            </nav>
          )
        }}
      </BookHubThemeContext.Consumer>
    )
  }
}
export default withRouter(Header)
