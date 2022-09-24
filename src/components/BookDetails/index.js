import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'
import Header from '../Header'
import Footer from '../Footer'
import BookHobThemeContext from '../../context/BookHubThemeContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookDetails extends Component {
  state = {bookDetails: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getBookDetails()
  }

  formattedData = data => ({
    aboutBook: data.about_book,
    aboutAuthor: data.about_author,
    authorName: data.author_name,
    coverPic: data.cover_pic,
    id: data.id,
    rating: data.rating,
    readStatus: data.read_status,
    title: data.title,
  })

  getBookDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const bookId = id

    const apiUrl = `https://apis.ccbp.in/book-hub/books/${bookId}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = this.formattedData(fetchedData.book_details)
      this.setState({
        bookDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickTryAgain = () => {
    this.getBookDetails()
  }

  renderBookDetailsView = () => (
    <BookHobThemeContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const bgColor = isDarkTheme ? 'card-dark-theme' : 'light-theme'
        const textColor = !isDarkTheme ? 'light-theme-text' : 'dark-theme-text'
        const {bookDetails} = this.state
        const {
          authorName,
          aboutAuthor,
          aboutBook,
          title,
          coverPic,
          readStatus,
          rating,
        } = bookDetails
        return (
          <div className={`book-details-responsive-container ${bgColor}`}>
            <div className="book-details-top-card">
              <div className="cover-pic-description">
                <img src={coverPic} className="cover-pic" alt={title} />
                <div className="book-description-container">
                  <h1 className={`title ${textColor}`}>{title}</h1>
                  <p className={`author-name ${textColor}`}>{authorName}</p>
                  <p className={`rating ${textColor}`}>
                    Avg Rating <BsFillStarFill size={12} className="star" />{' '}
                    {rating}
                  </p>
                  <p className={`read-status ${textColor}`}>
                    Status:{' '}
                    <span className="read-status-span-text">{readStatus}</span>
                  </p>
                </div>
              </div>
              <hr className="separator" />
              <h1 className={`about-heading ${textColor}`}>About Author</h1>
              <p className={`description ${textColor}`}>{aboutAuthor}</p>
              <h1 className={`about-heading ${textColor}`}>About Book</h1>
              <p className={`description ${textColor}`}>{aboutBook}</p>
            </div>
          </div>
        )
      }}
    </BookHobThemeContext.Consumer>
  )

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <BookHobThemeContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        const textColor = !isDarkTheme ? 'light-theme-text' : 'dark-theme-text'
        return (
          <div className="book-details-failure-view-container">
            <img
              src="https://res.cloudinary.com/dovk61e0h/image/upload/v1663608572/Bookhub/Group_7522Failure_Image_ykvhlm_gwy5rw.png"
              className="failure-image"
              alt="failure view"
            />
            <p className={`failure-heading ${textColor}`}>
              Something went wrong, Please try again.
            </p>
            <div>
              <button
                type="button"
                onClick={this.onClickTryAgain}
                className="try-again-button"
              >
                Try Again
              </button>
            </div>
          </div>
        )
      }}
    </BookHobThemeContext.Consumer>
  )

  renderBookDetailsBasedOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBookDetailsView()
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
      <BookHobThemeContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          const bgColor = isDarkTheme ? 'dark-theme' : 'light-theme'
          return (
            <div className={`bookdetails-container ${bgColor}`}>
              <Header />
              <div className={`responsive-container ${bgColor}`}>
                {this.renderBookDetailsBasedOnApiStatus()}
              </div>
              <Footer />
            </div>
          )
        }}
      </BookHobThemeContext.Consumer>
    )
  }
}

export default BookDetails
