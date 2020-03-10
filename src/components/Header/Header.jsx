import React, { memo, useState, useRef } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import classnames from "classnames";
import parse from "autosuggest-highlight/parse";
import _throttle from "lodash/throttle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import HomeIcon from "@material-ui/icons/Home";
import { makeStyles } from "@material-ui/core/styles";
import { loadScript } from "helpers/utils";
import useTimeout from "hooks/useTimeout";
import { addCity } from "store/actions";
import config from "config/config.json";
import "./Header.scss";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: "#fff"
  },
  inputRoot: {
    color: "inherit"
  },
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
}));

const autocompleteService = { current: null };
const navLinks = [
  { to: "/today", text: "Today" },
  { to: "/tomorrow", text: "Tomorrow" },
  { to: "/week", text: "Week" }
];

const Header = memo(props => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const [inputValue, setInputValue] = useState("");
  const [autoCompleteValue, setAutoCompleteValue] = useState("");
  const [options, setOptions] = useState(config.staticGoogleApiResponse);
  const loaded = useRef(false);
  const [callFetch] = useTimeout(fetch, 1500);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `${config.google_api}?key=${config.google_api_key}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  function fetch() {
    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    // Temporary comment for exceeded requests
    autocompleteService.current.getPlacePredictions({ input: inputValue, types: ["(cities)"] }, results => {
      setOptions(results || []);
    });
  }

  const handleChange = event => {
    setInputValue(event.target.value);
    callFetch();
  };

  const handleAutoCompleteChange = (e, value) => {
    if (value) {
      setAutoCompleteValue(value);
      const city = value.description.replace(/,.+/, "");
      const query = `q=${city}`;
      dispatch(addCity({ query }));
    }
  };

  return (
    <div className="Header">
      <AppBar className="HeaderBar">
        <Toolbar>
          <Link to="/" component={RouterLink}>
            <IconButton
              edge="start"
              color="secondary"
              className={classnames({ [classes.menuButton]: true, HomeButton: true, Active: pathname === "/" })}
            >
              <HomeIcon />
            </IconButton>
          </Link>
          <div className="HeaderLinks">
            {navLinks.map(link => (
              <Link
                key={link.to}
                className={classnames({ HeaderLink: true, Active: pathname === link.to })}
                component={RouterLink}
                to={link.to}
                color="secondary"
              >
                {link.text}
              </Link>
            ))}
          </div>
          <div className="HeaderSearch">
            <Autocomplete
              style={{ width: 300 }}
              getOptionLabel={option => (typeof option === "string" ? option : option.description)}
              filterOptions={x => x}
              options={options}
              value={autoCompleteValue}
              onChange={handleAutoCompleteChange}
              autoComplete
              includeInputInList
              disableOpenOnFocus
              renderInput={params => (
                <TextField
                  {...params}
                  className="Search"
                  label="Find city..."
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                />
              )}
              renderOption={option => {
                const matches = option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                  option.structured_formatting.main_text,
                  matches.map(match => [match.offset, match.offset + match.length])
                );

                return (
                  <Grid container alignItems="center">
                    <Grid item>
                      <LocationOnIcon className={classes.icon} />
                    </Grid>
                    <Grid item xs>
                      {parts.map((part, index) => (
                        <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                          {part.text}
                        </span>
                      ))}

                      <Typography variant="body2" color="textSecondary">
                        {option.structured_formatting.secondary_text}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
});

export default Header;
