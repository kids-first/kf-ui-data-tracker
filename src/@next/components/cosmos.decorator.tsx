import {BrowserRouter as Router} from 'react-router-dom';
const Decorator = ({children}: {children: React.ReactNode}) => (
    <Router>{children}</Router>
);

export default Decorator;
