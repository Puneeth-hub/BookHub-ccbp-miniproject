import {Component} from 'react'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import BookHubThemeContext from '../../context/BookHubThemeContext'
import './index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {booksList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getBooks()
  }

  formattedData = book => ({
    id: book.id,
    coverPic: book.cover_pic,
    title: book.title,
    authorName: book.author_name,
  })

  getBooks = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const getBooksUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'

    const response = await fetch(getBooksUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedList = fetchedData.books.map(eachBook =>
        this.formattedData(eachBook),
      )
      this.setState({
        booksList: updatedList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickTryAgain = () => {
    this.getBooks()
  }

  renderSlider = () => (
    <BookHubThemeContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const bgColor = isDarkTheme ? 'dark-slider' : 'slider-theme-light'
        const textColor = !isDarkTheme ? 'light-theme-text' : 'dark-theme-text'
        const {booksList} = this.state
        return (
          <ul className={`slick-container ${bgColor}`}>
            <Slider {...settings}>
              {booksList.map(eachBook => {
                const {coverPic, authorName, id, title} = eachBook
                return (
                  <Link to={`/books/${id}`} className="text-links">
                    <li key={id} className="slick-item">
                      <img
                        src={coverPic}
                        className="slick-item-cover-pic"
                        alt="title"
                      />
                      <h1 className={`title ${textColor}`}>{title}</h1>
                      <p className={`author-name ${textColor}`}>{authorName}</p>
                    </li>
                  </Link>
                )
              })}
            </Slider>
          </ul>
        )
      }}
    </BookHubThemeContext.Consumer>
  )

  renderLoader = () => (
    <div className="loader" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <BookHubThemeContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const textColor = !isDarkTheme ? 'light-theme-text' : 'dark-theme-text'
        return (
          <div className="home-failure-view-container">
            <img
              src="https://res.cloudinary.com/dovk61e0h/image/upload/v1663608572/Bookhub/Group_7522Failure_Image_ykvhlm_gwy5rw.png"
              className="home-failure-image"
              alt="failure view"
            />
            <p className={`${textColor} home-failure-heading`}>
              Something went wrong, Please try again.
            </p>
            <div>
              <button
                type="button"
                onClick={this.onClickTryAgain}
                className="home-try-again-button"
              >
                Try Again
              </button>
            </div>
          </div>
        )
      }}
    </BookHubThemeContext.Consumer>
  )

  renderBooksListBasedOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSlider()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <BookHubThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const bgColor = isDarkTheme ? 'dark-theme' : 'light-theme'
          const bgColor1 = isDarkTheme ? 'dark-slider' : 'slider-theme-light'
          const textColor = !isDarkTheme
            ? 'light-theme-text'
            : 'dark-theme-text'

          return (
            <div>
              <Header />
              <div className={`home-container ${bgColor}`}>
                <div className={`responsive-home ${bgColor}`}>
                  <h1 className={`heading ${textColor}`}>
                    Find Your Next Favorite Books
                  </h1>
                  <p className={`description ${textColor}`}>
                    You are in the right place. Tell us what titles or genres
                    you have enjoyed in the past, and we will give you
                    surprisingly insightful recommendations.
                  </p>
                  <div className={`slider-container ${bgColor1}`}>
                    <div className="top-rated-books-find-books">
                      <h1 className={`top-rated-books-heading ${textColor}`}>
                        Top Rated Books
                      </h1>
                      <div>
                        <Link to="/shelf">
                          <button type="button" className="find-books-button">
                            Find Books
                          </button>
                        </Link>
                      </div>
                    </div>
                    {this.renderBooksListBasedOnApiStatus()}
                  </div>
                  <Footer />
                </div>
              </div>
            </div>
          )
        }}
      </BookHubThemeContext.Consumer>
    )
  }
}
export default Home
