import { createReducer } from 'utils/index.js';
export const types = {
    ajaxRequest: 'ajax/request',
    ajaxDone: 'ajax/done'
};
export const ajaxReducer = createReducer(
    { isFetching: false },
    {
        [types.ajaxRequest]: cb,
        [types.ajaxDone]: cb
    }
);

export const ajaxActions = {
    ajaxRequest: () => ({ type: types.ajaxRequest }),
    ajaxDone: () => ({ type: types.ajaxDone })
};

function cb(state, action) {
    return action.type === types.ajaxRequest ? { isFetching: true } : { isFetching: false };
}
