import { FORM_PREVIEW_CLEARED, PREV_FORM_REQUESTED } from './actions';

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case FORM_PREVIEW_CLEARED:
            return { ...state, id: action.prevFormId };
        case PREV_FORM_REQUESTED:
            return initialState;
        default:
            return state;
    }
};
