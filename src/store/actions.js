import axios from "axios";
import config from "config/config.json";
import * as types from "./actionTypes";
import { SavedCitiesList } from "helpers/storage";

export const addCity = ({ city = null, query = "" }) => {
  return async dispatch => {
    dispatch({ type: types.ADD_CITY });
    try {
      if (city) {
        dispatch({ type: types.ADD_CITY_SUCCESS, payload: city });
      } else {
        const { data } = await axios.get(
          `${config.weather_api}/forecast?${query}&appid=${config.weather_api_key}`
        );
        dispatch({ type: types.ADD_CITY_SUCCESS, payload: data });
      }
    } catch (error) {
      dispatch({ type: types.ADD_CITY_ERROR, payload: error });
    }
  };
};

export const updateCityInfo = cityId => {
  return async dispatch => {
    dispatch({ type: types.UPDATE_CITY_INFO });
    try {
      const { data } = await axios.get(
        `${config.weather_api}/forecast?id=${cityId}&appid=${config.weather_api_key}`
      );
      const savedCitiesList = SavedCitiesList.get() || [];
      const newSavedCitiesList = savedCitiesList.map(c => {
        if (c.city.id === cityId) {
          return data;
        }
        return c;
      });
      SavedCitiesList.set(newSavedCitiesList);

      dispatch({ type: types.UPDATE_CITY_INFO_SUCCESS, payload: newSavedCitiesList });
    } catch (error) {
      dispatch({ type: types.UPDATE_CITY_INFO_ERROR, payload: error });
    }
  };
}

export const getCurrentWeather = (cityId) => {
  return async dispatch => {
    dispatch({ type: types.GET_CURRENT_WEATHER });

    try {
      const { data } = await axios.get(
        `${config.weather_api}/weather?id=${cityId}&appid=${config.weather_api_key}`
      );

      dispatch({ type: types.GET_CURRENT_WEATHER_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({ type: types.GET_CURRENT_WEATHER_ERROR, payload: error });
    }
  }
}

export const saveCity = city => {
  const savedCitiesList = SavedCitiesList.get() || [];
  const newSavedCitiesList = [...savedCitiesList, city];
  SavedCitiesList.set(newSavedCitiesList);

  return {
    type: types.SAVE_CITY,
    payload: newSavedCitiesList
  };
};

export const removeCity = cityId => {
  const savedCitiesList = SavedCitiesList.get() || [];
  const newSavedCitiesList = savedCitiesList.filter(c => c.city.id !== cityId);
  SavedCitiesList.set(newSavedCitiesList);

  return {
    type: types.REMOVE_CITY,
    payload: newSavedCitiesList
  };
};
