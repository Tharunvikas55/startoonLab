import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const searchHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate('/admin-dashboard?keyword=' + encodeURIComponent(keyword));
        }
    };

    return (
        <div className="input-group">
            <form className="d-flex" onSubmit={searchHandler}>
                <input 
                    className="form-control me-2" 
                    onChange={(e) => setKeyword(e.target.value)} 
                    type="text" 
                    placeholder="Search" 
                    aria-label="Search" 
                />
                <button className="btn btn-outline-success" type="submit">Search</button>
            </form>
        </div>
    );
}
