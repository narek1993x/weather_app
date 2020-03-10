import React, { memo, useState } from "react";
import classnames from "classnames";
import _get from "lodash/get";
import Paper from "@material-ui/core/Paper";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CachedIcon from "@material-ui/icons/Cached";
import Loader from "components/Loader";
import useAnimate from "hooks/useAnimate";
import { calculateCelsius, emptyFunction } from "helpers/utils";
import "./Display.scss";

const Display = memo(props => {
  const {
    loading = false,
    city,
    celsius,
    weather = "",
    wind = "",
    showInfo,
    onClick = emptyFunction,
    onUpdate = null,
    onRemove = null
  } = props;
  const [animate, callAnimate] = useAnimate();

  const windText = wind ? `, Wind ${wind} - meter per second` : "";
  const weatherText = `${weather}`;

  const handleUpdate = e => {
    onUpdate(e);
    callAnimate();
  };

  return (
    <Paper className="Display" onClick={onClick}>
      {loading && <Loader />}
      {city && <div className="Celsius">{calculateCelsius(celsius)} °C</div>}
      {city && <div className="DisplayTitle">{`${city.name}, ${city.country}`}</div>}
      {showInfo && <div className="Info">{`${weatherText}${windText}`}</div>}
      {onUpdate && <CachedIcon className={classnames({ UpdateIcon: true, Animate: animate })} onClick={handleUpdate} />}
      {onRemove && <HighlightOffIcon className="RemoveIcon" fontSize="small" onClick={onRemove} />}
    </Paper>
  );
});

export default Display;
