export function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

export function calculateCelsius(kelvin) {
  return Math.round(kelvin - 273.15);
}

export function generateFiveDayForecast(cityData) {
  const newList = [];
  let lastDate = "";

  if (!cityData || !cityData.list) return cityData;

  cityData.list.forEach(item => {
    const date = item.dt_txt.slice(0, 10); 
    if (date !== lastDate) {
      newList.push(item);
      lastDate = date;
    }
  });

  return { ...cityData, list: newList };
}

export function getDayForecast(list, date) {
  const newList = [];

  if (!Array.isArray(list)) return [];

  list.forEach(item => {
    const itemDate = item.dt_txt.slice(0, 10); 
    if (itemDate === date) {
      newList.push(item);
    }
  });

  return newList;
} 

export function emptyFunction() {}
