import * as types from "./actionTypes";
import config from "config/config.json";
import { SavedCitiesList } from "helpers/storage";


const initialState = () => ({
  loading: false,
  updateLoading: false,
  cityWeatherInfo: config.staticWeatherApiWeaklyResponse,
  currentWeather: {},
  error: null,
  savedCitiesList: SavedCitiesList.get() || [],
});

const reducer = (state = initialState(), action) => {
  switch (action.type) {
    case types.ADD_CITY:
      return { ...state, loading: true };
    case types.ADD_CITY_SUCCESS:
      return { ...state, loading: false, cityWeatherInfo: action.payload };
    case types.ADD_CITY_ERROR:
      return { ...state, loading: false, error: action.payload };

    case types.UPDATE_CITY_INFO:
      return { ...state, updateLoading: true };
    case types.UPDATE_CITY_INFO_SUCCESS:
      return { ...state, updateLoading: false, savedCitiesList: action.payload };
    case types.UPDATE_CITY_INFO_ERROR:
      return { ...state, updateLoading: false, error: action.payload };

    case types.GET_CURRENT_WEATHER:
      return { ...state };
    case types.GET_CURRENT_WEATHER_SUCCESS:
      return { ...state, currentWeather: action.payload };
    case types.GET_CURRENT_WEATHER_ERROR:
      return { ...state, error: action.payload };

    case types.SAVE_CITY:
      return { ...state, savedCitiesList: action.payload }
    case types.REMOVE_CITY:
      return { ...state, savedCitiesList: action.payload }

    default:
      return state;
  }
};

export default reducer;
