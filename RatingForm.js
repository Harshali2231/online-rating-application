
RatingForm.js

jsx
import React, { useState } from 'react';
import axios from 'axios';

function RatingForm(props) {
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(/stores/${props.storeId}/ratings, { rating });
            // Handle successful submission
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Rating:</label>
            <select value={rating} onChange={(event) => setRating(event.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
            <button type="submit">Submit Rating</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}