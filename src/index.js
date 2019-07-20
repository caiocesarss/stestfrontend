import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import './index.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'

import App from './App';

import promise from 'redux-promise';
import multi from 'redux-multi'
import thunk from 'redux-thunk'

import reducers from "./redux/Reducers";

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__
    && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = applyMiddleware(multi, thunk, promise)(createStore)(reducers, devTools);


ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));