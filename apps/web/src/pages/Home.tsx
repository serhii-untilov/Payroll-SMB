import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <h1>Home Page</h1>
            <Link to="/users/42">Go to User 42 Page</Link>
        </div>
    );
}
