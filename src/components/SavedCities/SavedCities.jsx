import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import Paper from "@material-ui/core/Paper";
import Display from "components/Display";
import { addCity, updateCityInfo, removeCity } from "store/actions";
import "./SavedCities.scss";

const SavedCities = memo(props => {
  const dispatch = useDispatch();
  const savedCitiesList = useSelector(state => state.weather.savedCitiesList);

  const handleCityClick = city => {
    return () => {
      dispatch(addCity({ city }));
    };
  };

  const handleCityUpdate = city => {
    const updateCityId = _get(city, "city.id", null);
    return (e) => {
      e.stopPropagation();
      dispatch(updateCityInfo(updateCityId));
    };
  };

  const handleCityRemove = city => {
    const removeCityId = _get(city, "city.id", null);
    return (e) => {
      e.stopPropagation();
      dispatch(removeCity(removeCityId));
    };
  };

  return (
    <Paper className="SavedCities">
      <div className="Title">Saved cities</div>
      <div className="SavedCitiesList">
        {savedCitiesList.map((c, i) => {
          const city = _get(c, "city", null);
          const celsius = _get(c, "list[0]main.temp", 0);

          return (
            <Display
              key={i}
              showInfo={false}
              city={city}
              celsius={celsius}
              onClick={handleCityClick(c)}
              onUpdate={handleCityUpdate(c)}
              onRemove={handleCityRemove(c)}
            />
          );
        })}
      </div>
    </Paper>
  );
});

export default SavedCities;
