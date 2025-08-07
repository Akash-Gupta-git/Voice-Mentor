import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../css/App.css'; // Make sure your App.css has the styles

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <Spinner animation="grow" variant="primary" role="status" className="mb-3" />
                <h3 className="text-white">Loading...</h3>
            </div>
        </div>
    );
};

export default Loading;