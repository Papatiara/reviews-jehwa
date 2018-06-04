import React from 'react';
import ReactDOM from 'react-dom';
import ReviewListEntry from './ReviewListEntry.jsx';

const ReviewList = props => (
  <div className="mainReviews">
    {props.reviews.map((review, index) => (
      <ReviewListEntry review={review} key={index} />
      ))}
  </div>
);

export default ReviewList;
