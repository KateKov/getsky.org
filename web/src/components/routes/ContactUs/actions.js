import { sendFeedback } from 'api/index';

export const SUBMIT_FEEDBACK_FORM = 'SUBMIT_FEEDBACK_FORM';
export const submitFeedbackForm = feedback => async dispatch => {
    await sendFeedback(feedback);
    dispatch(destroyForm());
    dispatch({ type: SUBMIT_FEEDBACK_FORM });
};

const destroyForm = () => ({
    type: '@@redux-form/DESTROY',
    meta: {
        form: [
            'contactUsForm',
        ]
    }
});
