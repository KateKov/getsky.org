import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'

import latestAdverts from './routes/LatestAdverts/reducers';
import login from './routes/Login/reducers';
import advertDetails from './routes/AdvertDetails/reducers';
import messages from './routes/AdvertDetails/Messages/reducers';
import dashboard from './routes/Dashboard/reducers';
import preview from './routes/PostingsPreview/reducers';
import search from './routes/SearchAdverts/reducers';
import app from './AppInitializer/reducers';
import registration from './routes/Registration/reducers';

const rootReducer = combineReducers({
    routing: routerReducer,
    form: formReducer,
    app,
    latestAdverts,
    login,
    advertDetails,
    messages,
    preview,
    dashboard,
    search,
    registration,
});


export default rootReducer;
