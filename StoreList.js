StoreList.js

jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StoreList() {
    const [stores, setStores] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axios.get('/stores');
                setStores(response.data);
            } catch (error) {
                setError(error.response.data.message);
            }
        };
        fetchStores();
    }, []);

    return (
        <div>
            <h1>Store List</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {stores.map((store) => (
                    <li key={store.id}>{store.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default StoreList;