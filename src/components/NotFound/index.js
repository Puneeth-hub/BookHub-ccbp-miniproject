import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dovk61e0h/image/upload/v1663608572/Bookhub/Group_7484PageNotFound_o7uk9v_pgcn3p.png"
      className="not-found-image"
      alt="not found"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-description">
      we are sorry, the page you requested could not be found, Please go back to
      the homepage.
    </p>

    <Link to="/" className="text-link">
      <button type="button" className="go-back-to-home-button">
        Go Back to Home
      </button>
    </Link>
  </div>
)

export default NotFound
