import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, totalStars = 5 }) => {
    return (
        <div className="flex">
            {[...Array(totalStars)].map((_, index) => {
                const value = index + 1;
                return (
                    <FaStar
                        key={value}
                        className={`text-2xl ${value <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;
