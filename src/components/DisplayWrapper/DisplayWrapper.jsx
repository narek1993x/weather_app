import React, { memo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import _get from "lodash/get";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Alert from "@material-ui/lab/Alert";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Display from "components/Display";
import useAnimate from "hooks/useAnimate";
import { addCity, saveCity } from "store/actions";
import "./DisplayWrapper.scss";

const DisplayWrapper = memo(() => {
  const [alreadyUpdated, setAlreadyUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  const cityWeatherInfo = useSelector(state => state.weather.cityWeatherInfo);
  const cityWeatherLoading = useSelector(state => state.weather.loading);
  const savedCitiesList = useSelector(state => state.weather.savedCitiesList);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [animate, callAnimate] = useAnimate();
  const isHomePage = pathname === "/";

  const city = _get(cityWeatherInfo, "city", null);
  const firstDay = _get(cityWeatherInfo, "list[0]", {});
  const celsius = _get(firstDay, "main.temp", 0);
  const weather = _get(firstDay, "weather[0]main", "");
  const wind = _get(firstDay, "wind.speed", "");

  useEffect(() => {
    getInitialLocation();
  }, []);

  const handleAddCity = () => {
    const activeCityId = _get(cityWeatherInfo, "city.id", null);
    const isNotAdded = savedCitiesList.every(c => c.city.id !== activeCityId);

    if (alreadyUpdated) {
      setAlreadyUpdated(false);
    }

    if (isNotAdded) {
      dispatch(saveCity(cityWeatherInfo));
      callAnimate();
    } else {
      setAlreadyUpdated(true);
      callAnimate();
    }
  };

  const getInitialLocation = async () => {
    if (navigator.geolocation) {
      setLoading(true);
      await navigator.geolocation.getCurrentPosition(
        position => {
          setLoading(false);
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const query = `lat=${lat}&lon=${lon}`;
          // Temporary comment for exceeded requests
          dispatch(addCity({ query }));
        },
        err => {
          setLoading(false);
          console.warn(`ERROR(${err.code}): ${err.message}`);
        }
      );
    }
  };

  return (
    <Paper className={classnames({ DisplayWrapper: true, MainDisplay: isHomePage })}>
      <Display loading={loading || cityWeatherLoading} showInfo={isHomePage} city={city} celsius={celsius} weather={weather} wind={wind} />
      <IconButton edge="start" className="AddCity" onClick={handleAddCity}>
        <AddCircleOutlineIcon fontSize="large" />
      </IconButton>
      <Alert className={classnames({ AlertMessage: true, Show: animate })} severity="success">
        {alreadyUpdated ? "City already added!" : "City successfully saved."}
      </Alert>
    </Paper>
  );
});

export default DisplayWrapper;
