import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function Search() {
    const [keyword, setKeyword]  = useState("");
    const navigate = useNavigate();

    const searchHandler = () => {
        navigate('/search?keyword='+keyword)
    }

    return   <div className="input-group">
                <form className="d-flex">
        <input className="form-control me-2" onChange={(e) => setKeyword(e.target.value)} onBlur={searchHandler} type="text" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" onClick={searchHandler}  >Search</button>
      </form>
            </div>
}