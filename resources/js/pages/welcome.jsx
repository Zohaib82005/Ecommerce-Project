import Navbar from '../components/Navbar.jsx'
import Carousel from '../components/Carousel.jsx'
import Category from '../components/Category.jsx'
import Featured from '../components/Featured.jsx'
import Deals from '../components/Deals.jsx'
import Choose from '../components/Choose.jsx'
import Reviews from '../components/Reviews.jsx'
import Footer from '../components/Footer.jsx'
function Welcome(){
    return (<>
    <Navbar/>
    <Carousel/>
<Category/>
<Featured/>
<Deals/>
<Choose/>
<Reviews/>
<Footer/>
    </>
    );
}

export default Welcome;
