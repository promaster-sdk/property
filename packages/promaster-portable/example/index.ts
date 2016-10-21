import * as ReactDOM from 'react-dom';
import { app } from './components/app';
//import { bootstrap } from './bootstrap';

//// Bootstrap the app
//bootstrap();

// Draw react
const mountNode = document.getElementById('root');
ReactDOM.render(app({}), mountNode);
