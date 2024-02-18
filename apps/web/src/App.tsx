import { useRoutes } from 'react-router-dom';
import routes from './router/router';

export default function App() {
    const content = useRoutes(routes);
    return content;
}
