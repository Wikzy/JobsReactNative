import * as api from '../../API/index'
import {ALL_CATEGORIES, LOADING, SUCCESS} from "../../Utils/Constants";

export const fetchSeeker = () => async (dispatch) => {
    try {
        dispatch ({ type: LOADING })
        const { data: { data } } = await api.fetchSeeker();
        dispatch ({ type: ALL_CATEGORIES, payload: { categories: data } })
        dispatch ({ type: SUCCESS })
    } catch (error) {
        console.log(error)
    }
}
