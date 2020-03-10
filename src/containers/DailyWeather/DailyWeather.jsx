import React from "react";
import DayWeather from "components/DayWeather";

const DailyWeather = ({ tomorrow }) => {
  return (
    <div className="DailyWeather">
      <DayWeather isTomorrow={tomorrow} />
    </div>
  );
};

export default DailyWeather;
