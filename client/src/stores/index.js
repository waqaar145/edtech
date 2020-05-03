import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers/index";
import {composeWithDevTools} from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: []
}

const persistedReducer = persistReducer(persistConfig, reducer)

export default (preloadedState) => {
  const store = createStore(persistedReducer, preloadedState, composeWithDevTools(applyMiddleware(thunk)));
  return { store, persistor: persistStore(store) };
}
