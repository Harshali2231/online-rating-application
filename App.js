App.js

jsx
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/stores" element={<StoreList />} />
                <Route path="/stores/:id" element={<StoreDetails />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;


StoreDetails.js

jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RatingForm from './RatingForm';

function StoreDetails() {
    const [store, setStore] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const response = await axios.get(/stores/${window.location.pathname.split('/')[2]});
                setStore(response.data);
            } catch (error) {
                setError(error.response.data.message);
            }
        };
        fetchStore();
    }, []);

    return (
        <div>
            <h1>Store Details</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>Name: {store.name}</p>
            <p>Address: {store.address}</p>
            <RatingForm storeId={store.id} />
        </div>
    );
}
