import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import weather from './reducer';

const reducers = combineReducers({
  weather
});

const composedEnhancers = composeWithDevTools(applyMiddleware(thunk));
const store = createStore(reducers, composedEnhancers);

export default store;