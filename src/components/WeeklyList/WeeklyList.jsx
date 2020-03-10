import React, { memo } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import _get from "lodash/get";
import Paper from "@material-ui/core/Paper";
import Display from "components/Display";
import { generateFiveDayForecast,  } from "helpers/utils";
import "./WeeklyList.scss";

const WeeklyList = memo((props) => {
  const cityWeatherInfo = generateFiveDayForecast(useSelector(state => state.weather.cityWeatherInfo));

  const city = _get(cityWeatherInfo, "city", null);
  const startWeek = _get(cityWeatherInfo, "list[0].dt_txt", "");
  const endWeek = _get(cityWeatherInfo, "list[5].dt_txt", _get(cityWeatherInfo, "list[4].dt_txt", ""));
  const weekList = _get(cityWeatherInfo, 'list', []);
  const subtitle = `${handleMomentFormat(startWeek)} - ${handleMomentFormat(endWeek)}`;

  function handleMomentFormat(date) {
    return moment(date).format("MMM Do");
  }

  return (
    <Paper className="WeeklyList">
      <div className="Title">Week</div>
      <div className="Subtitle">{subtitle}</div>
      <div className="WeeklyListList">
        {weekList.map((info, i) => {
          const celsius = _get(info, "main.temp", 0);
          const weather = _get(info, "weather[0]main", "");
          return <Display key={i} showInfo city={city} celsius={celsius} weather={weather} />;
        })}
      </div>
    </Paper>
  );
});

export default WeeklyList;
