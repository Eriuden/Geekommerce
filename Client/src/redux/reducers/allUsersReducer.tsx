import { GET_USERS } from "../actions/users.action";

const initialState = {}

export const allUsersReducer = ( state = initialState, action: any) => {
    switch (action.type) {
        case GET_USERS:
            return action.payload
        default:
            return state
    }
} 