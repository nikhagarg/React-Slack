export const initialState = {
    user : null,
    handleHighlighted : {
        selected: '',
        id: null
    }
};

export const actionTypes = {
    SET_USER: "SET_USER",
    UPDATE_USER_PHOTO: "UPDATE_USER_PHOTO",
    UPDATE_USER_NAME: "UPDATE_USER_NAME",
    HIGHLIGHT_HANDLE: "HIGHLIGHT_HANDLE"
}

// we refer the data layer as state. Anything inside the data layer is state
// We manipulate the data layer with actions.
function reducer(state, action) {
    console.log("action", action);

    switch(action.type) {
        case actionTypes.SET_USER: 
            return {
                ...state,
                user: action.user
            }
        case actionTypes.UPDATE_USER_NAME:
            let newUser1 = state.user;
            newUser1.displayName = action.newName;
            return {
                ...state,
                user: newUser1
            }
        case actionTypes.UPDATE_USER_PHOTO:
            let newUser2 = state.user;
            newUser2.photoUrl = action.newUrl;
            return {
                ...state,
                user: newUser2
            }
        case actionTypes.HIGHLIGHT_HANDLE:
            return {
                ...state,
                handleHighlighted: {
                    selectedType: action.selectedType,
                    id: action.id
                }
            }
        default: 
            return state;
    }

};

export default reducer;