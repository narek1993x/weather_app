import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _get from "lodash/get";
import _throttle from "lodash/throttle";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import { getCurrentWeather } from "store/actions"
import { getDayForecast, calculateCelsius } from "helpers/utils";
import "./DayWeather.scss";

const markerInfo = { current: null };
const mapHolder = { current: null };
const DayWeather = memo(props => {
  const { isTomorrow } = props;
  const dispatch = useDispatch();
  const cityWeatherInfo = useSelector(state => state.weather.cityWeatherInfo);
  const forecastList = _get(cityWeatherInfo, "list", []);
  const cityCoord = _get(cityWeatherInfo, "city.coord", { lat: 0, lon: 0 });
  const cityId = _get(cityWeatherInfo, "city.id", null);

  useEffect(() => {
    googleMapLoadingCb();
  }, []);

  const googleMapLoadingCb = _throttle(() => {
    if (window.google) {   
      const position = { lat: cityCoord.lat, lng: cityCoord.lon };   
      const map = new google.maps.Map(document.getElementById("map"), { zoom: 10, center: position });
      mapHolder.current = map;

      addMarker(position, map); 
    } else {
      googleMapLoadingCb();
    }
  }, 300);

  const addMarker = (position, map) => {
    const marker = new google.maps.Marker({
      map,
      position,
    });

    marker.addListener("click", async (e) => {
      await addMarkerInfoWindow(cityId);

      if (markerInfo.current) {
        markerInfo.current.open(mapHolder.current, marker);
      }
    })
  }

  const addMarkerInfoWindow = async () => {
    const currentCityWeather = await dispatch(getCurrentWeather(cityId));
    const celcius = _get(currentCityWeather, "main.temp", 0);
    const wind = _get(currentCityWeather, "wind.speed", 0);
    const weather = _get(currentCityWeather, "weather[0].main", "");
    const celciusText = `${calculateCelsius(celcius)} °C`;
    const weatherText = `${weather}, Wind ${wind} - meter per second`;

    const infoWindow = new google.maps.InfoWindow({
      content: `<div><div className="Celsius">${celciusText}</div><div className="Info">${weatherText}</div></div>`
    });

    markerInfo.current = infoWindow;
  }

  const today = moment(new Date()).format("YYYY-MM-DD");
  const tomorrow = moment(new Date())
    .add(1, "days")
    .format("YYYY-MM-DD");
  const todayForecast = getDayForecast(forecastList, isTomorrow ? tomorrow : today);

  const formatSubTitle = date => {
    return moment(date).format("MMMM, DD");
  };

  return (
    <Paper className="DayWeather">
      <div className="RightSide">
        <div className="Title">{isTomorrow ? "Tomorrow" : "Today"}</div>
        <div className="Subtitle">{formatSubTitle(isTomorrow ? tomorrow : today)}</div>
        <div className="DayWeatherInfo">
          <div className="DayWeatherText">
            <div>Time</div>
            <div>Weather</div>
          </div>
          <div className="Divider" />
          <div className="DayWeatherForeCastList">
            {todayForecast.map(forecast => {
              const time = moment(forecast.dt_txt).format("HH:mm");

              return (
                <div key={forecast.dt} className="DayWeatherForeCastListItem">
                  <div>{time}</div>
                  <div>{`Wind ${forecast.wind.speed} - meter per second`}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="LeftSide">
        <div id="map"></div>
      </div>
    </Paper>
  );
});

export default DayWeather;
