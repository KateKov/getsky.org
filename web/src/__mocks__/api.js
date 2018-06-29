export const getAllAdverts = () => new Promise((resolve, reject) => {
    resolve({ sellAdverts: [], buyAdverts: [] });
});

export const getAllAdverts404 = () => new Promise((resolve, reject) => {
    reject({ response: { status: 404 } });
});

export const loginOk = () => new Promise((resolve, reject) => {
    resolve({});
});

export const login401 = () => new Promise((resolve, reject) => {
    reject({ response: { status: 401 } });
});

export const registerUserOk = () => new Promise((resolve, reject) => {
    resolve({});
});

export const registerUser400 = () => new Promise((resolve, reject) => {
    reject({
        response: { status: 400, data: { '0': { key: 'stubField', message: 'stubMessage' } } }
    })
});

export const getAdvertDetailsOk = details => id => new Promise((resolve, reject) => {
    resolve({ data: details });
});

export const getAdvertDetails404 = id => new Promise((resolve, reject) => {
    reject({ response: { status: 404 } });
});

export const getSkycoinPriceOk = price => () => new Promise((resolve, reject) => {
    resolve({ data: [{ code: "EUR", price: "19.4068220127" }, { code: "UAH", price: "601.275954735" }, { code: "USD", price: "22.9115" }] });
});

export const getStatesOk = () => new Promise((resolve, reject) => { resolve({ data: [] }) })

export const getCountriesOk = () => new Promise((resolve, reject) => { resolve({ data: [] }) })

export const getUserInfoApiOk = () => new Promise((resolve, reject) => { resolve({ data: {} }) })

export const updateUserSettingsOk = settings => new Promise((resolve, reject) => { resolve({ data: {} }) })
export const changePasswordOk = form => new Promise((resolve, reject) => { resolve({ data: {} }) })

export const createBuyAdvertOk = settings => new Promise((resolve, reject) => { resolve({}) });

export const createSellAdvertOk = settings => new Promise((resolve, reject) => { resolve({}) });

export const postAdvertMessageOk = (advertId, message) => new Promise((resolve, reject) => { resolve({ data: message }) });

export const getAdvertMessagesOk = messagesStub => (advertId, username) => new Promise((resolve, reject) => { resolve({ data: messagesStub }) });

export const getAdvertMessagesAuthorsOk = messagesAuthorsStub => advertId => new Promise((resolve, reject) => { resolve({ data: messagesAuthorsStub }) });

export const updateAdvertMessageOk = messageStub => (messageId, message) => new Promise((resolve, reject) => { resolve({ data: messageStub }) });

export const getAdvertsForDashboardOk = (advertsStub) => () => new Promise((resolve, reject) => resolve({ data: advertsStub }));

export const deleteAdvertOk = advertId => new Promise((resolve, reject) => resolve({ data: {} }));

export const extendExpirationDateOk = advertId => new Promise((resolve, reject) => resolve({ data: {} }));

export const resetPasswordRequestOk = requestForm => () => new Promise((resolve, reject) => resolve());

export const resetPasswordRequest404 = requestForm => () => new Promise((resolve, reject) => {
    reject({ response: { status: 404 } })
});

export const saveNewPasswordOk = requestForm => requestForm => new Promise((resolve, reject) => resolve());

export const saveNewPasswordFail = requestForm => requestForm => new Promise((resolve, reject) =>
    reject({ response: { status: 404 } })
);

export const searchAllAdverts = () => new Promise((resolve, reject) => {
    resolve({ sellAdverts: [], buyAdverts: [] });
});

export const searchAllAdvertsFail = () => new Promise((resolve, reject) => {
    reject({ response: { data: 'error' } });
});