import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ReviewList from './ReviewList.jsx';
import Sorting from './Sorting.jsx';
import ReviewSummary from './ReviewSummary.jsx';
import PageSelector from './PageSelector.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      timeline: [],
      filtered: [],
      eachPage: [],
      sortedByStars: false,
      sortedByTime: false,
      totalReviews: '',
      currentPage: 1,
    };
    this.bringData = this.bringData.bind(this);
    this.sortedByNumber = this.sortedByNumber.bind(this);
    this.changePage = this.changePage.bind(this);
    this.movePage = this.movePage.bind(this);
  }

  componentDidMount() {
    this.bringData();
  }

  bringData() {
    axios.get('/1/init')
      .then((res) => {
        let validStars = res.data.filter((review) => review.stars > 0);
        let aveStar = validStars.reduce((acc, val) => (acc + val.stars),0)/validStars.length;
        let validFitRatings = res.data.filter((review) => review.fitRating > 0);
        let aveFitRating = Math.round(validFitRatings.reduce((acc, val) => (acc + val.fitRating),0)/validFitRatings.length);
        let validWidthRatings = res.data.filter((review) => review.widthRating > 0);
        let aveWidthRating = Math.round(validWidthRatings.reduce((acc, val) => (acc + val.widthRating),0)/validWidthRatings.length);
        let timeline = res.data.slice().sort((a,b) => new Date(b.date) - new Date(a.date));

        this.setState({
          reviews: res.data.slice(),
          filtered: res.data.slice(),
          timeline: timeline,
          eachPage: res.data.slice(0,5),
          aveStar: aveStar,
          aveFitRating: aveFitRating,
          aveWidthRating: aveWidthRating,
          totalReviews: res.data.length,
        });
      })
      .catch((err) => {
        console.log(err, 'error from server');
      });
  }

  sortedByNumber(starNum) {
    let filtered;
    if(starNum === 0) {
      if(!this.state.sortedByTime) {
        filtered = this.state.reviews;
      } else {
        filtered = this.state.timeline.slice();
      }
      this.setState({
        sortedByStars: false,
      })
    }
    if(starNum > 0 && starNum < 6) {
      if (!this.state.sortedByTime) {
        filtered = this.state.reviews.filter(review => review.stars === starNum);
      } else {
        filtered = this.state.timeline.filter(review => review.stars === starNum);
      }
      this.setState({
        sortedByStars: true,
      })
    }
    if(starNum === 10) {
      if(!this.state.sortedByStars) {
        filtered = this.state.filtered.sort((a, b) => b.stars - a.stars);
      } else {
        filtered = this.state.filtered;
      }
      this.setState({
        sortedByTime: false,
      })
    }
    if(starNum === 11) {
      if(this.state.sortedByStars) {
        filtered = this.state.filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        this.setState({
          sortedBy: true,
        })
      } else {
        filtered = this.state.timeline.slice();
      }
      this.setState({
        sortedByTime: true,
      })

    }
    this.setState({
      filtered: filtered,
      eachPage: filtered.slice(0,5),
      currentPage: 1,
    })
  }

  changePage(pageNum) {
    let pageView = this.state.filtered.slice((5 * (pageNum - 1)), 5 * pageNum);
    this.setState({
      eachPage: pageView,
      currentPage: pageNum
    })
  }

  movePage(direction) {
    let newPage;
    if(direction === 'previous') {
      newPage = this.state.currentPage - 1;
    } else {
      newPage = this.state.currentPage + 1;
    }
    this.setState({
      currentPage: newPage,
      eachPage: this.state.filtered.slice((5 * (newPage - 1)), 5 * newPage)
    })
  }

  render() {
    return (
      <div className="nerdstromReviewPage">
        <div className="reviewSummaryMain">
          <ReviewSummary 
          aveStar={this.state.aveStar} 
          aveFitRating={this.state.aveFitRating} 
          aveWidthRating={this.state.aveWidthRating} 
          totalReviews={this.state.totalReviews}
          />
        </div>
        <div className="sorting" >
          <Sorting sortedByNumber={this.sortedByNumber} />
        </div>
        <div className="reviews">
          <ReviewList reviews={this.state.eachPage} />
        </div>
        <div className="pageSelector">
          <PageSelector 
          currentPage={this.state.currentPage} 
          totalPage={Math.ceil(this.state.filtered.length/5)} 
          changePage={this.changePage}
          movePage={this.movePage}
          />
        </div>
      </div>
    );
  }
}
export default App;

ReactDOM.render(<App />, document.getElementById('app'));
