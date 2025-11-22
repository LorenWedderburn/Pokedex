// Selectors

const lblPkmName = document.querySelector(".lbl_pkm-name");
const lblPkmId = document.querySelector(".lbl_pkm-id");
const lblPkmHealth = document.querySelector(".lbl_pkm-hp");
const lblPkmAttack = document.querySelector(".lbl_pkm-attack");
const lblPkmDefense = document.querySelector(".lbl_pkm-defense");
const lblPkmSpecAttack = document.querySelector(".lbl_pkm-spec-attack");
const lblPkmSpeckDefense = document.querySelector(".lbl_pkm-spec-defense");
const lblPkmSpeed = document.querySelector(".lbl_pkm-speed");
const lblAll = document.querySelectorAll(".pkm-stats");

const divPokedexTopInside = document.querySelector(".pokedex-top-inside");
const divPokedexTopOutside = document.querySelector(".pokedex-top-outside");

const divInsideScreen = document.querySelector("#inside-screen");

// Buttons

const btnPkmSearch = document.querySelector(".btn_pkm_search");
const btnPkmSelect = document.querySelector(".btn_pkm_select");
const btnPkmMap = document.querySelector(".btn_pkm_map");
const btnPkmPokedex = document.querySelector(".btn_pkm_pokedex");
const btnPkmSubmit = document.querySelector(".btn_pkm_submit");

const btnScreenModeText = document.querySelector("#btn-screen-mode-text");
const btnScreenModeTime = document.querySelector("#btn-screen-mode-time");
const btnScreenModeWeather = document.querySelector("#btn-screen-mode-weather");

// Navigation Buttons

const btnLeft = document.querySelector(".img_left-arrow");
const btnRight = document.querySelector(".img_right-arrow");
const btnUp = document.querySelector(".img_up-arrow");
const btnDown = document.querySelector(".img_down-arrow");

const openPokedex = document.querySelector("#img-outside-return");
const closePokedex = document.querySelector("#img-inside-return");

//Audio

const soundsEffects = document.querySelector(".sound-effects");

const txtPkmText = document.querySelector("#text-search");
const txtPkmKeyboard = document.querySelector("#text-keyboard");
const displayPkm = document.querySelector(".display");
const loader = document.querySelector(".loader");

//Popups
let nonEventPopups = document.querySelectorAll(".non-encounter-popup");
let eventPopups = document.querySelectorAll(".encounter-popup");

//  ***Events!***

class Event {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, description) {
    this.coords = coords;
    this.description = description;
  }
}

class NonPokemonEvent extends Event {
  type = "non-encounter";
  constructor(coords, description) {
    super(coords, description);
    // this.type = type;
  }
}

class Encounter extends Event {
  type = "encounter";
  constructor(coords, description, pokemonName, pokemonImage) {
    super(coords, description);
    this.pokemonName = pokemonName;
    this.pokemonImage = pokemonImage;
  }
}

// ***Events!***

// ***Modules!***

class Module {
  name;
  #elements = [];
  constructor(name) {
    this.name = name;
  }

  onLoad(screen) {
    throw new Error("On load missing");
  }

  onUnLoad(screen) {
    throw new Error("Unload missing");
  }

  moduleEvent() {
    throw new Error("Module Event Error!");
  }
}

class ModuleEvent {
  name;
  constructor(name) {
    this.name = name;
  }
}

class SubmitBtnPressed extends ModuleEvent {
  constructor() {
    super("SubmitBtnPressed");
  }
}

class TextModule extends Module {
  constructor() {
    super("text");
  }
  onLoad(screen) {
    screen.innerHTML =
      "<textarea class=smt-textbox id=smt-displaytext readonly></textarea>";
  }

  onUnLoad(screen) {
    screen.innerHTML = "";
  }

  moduleEvent(e) {
    document.querySelector("#smt-displaytext").textContent =
      txtPkmKeyboard.value;
  }
}

class AzModule extends Module {
  constructor() {
    super("Az");
  }
  onLoad(screen) {
    screen.innerHTML = '<img src="./images/Squirtle.png" id="ihatethisman">';
    document.querySelector("#ihatethisman").addEventListener("click", () => {
      alert("Fuck Az!");
    });
  }

  onUnLoad(screen) {
    screen.innerHTML = "";
  }
}

class TimeModule extends Module {
  constructor() {
    super("Time");
  }
  onLoad(screen) {
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let mins = currentTime.getMinutes();
    let secs = currentTime.getSeconds();

    screen.innerHTML = `
    <div id="clock-display">
      <span id="clock-hours">${hours < 10 ? `0` + hours : hours}</span>
      <span>:</span>
      <span id="clock-mins">${mins < 10 ? `0` + mins : mins}</span>
      <span>:</span>
      <span id="clock-secs">${secs < 10 ? `0` + secs : secs}</span>
    </div>`;

    let displayHours = document.querySelector("#clock-hours");
    let displayMins = document.querySelector("#clock-mins");
    let displaySecs = document.querySelector("#clock-secs");

    setInterval(() => {
      currentTime = new Date();
      hours = currentTime.getHours();
      mins = currentTime.getMinutes();
      secs = currentTime.getSeconds();

      displayHours.textContent = hours < 10 ? `0` + hours : hours;
      displayMins.textContent = mins < 10 ? `0` + mins : mins;
      displaySecs.textContent = secs < 10 ? `0` + secs : secs;
    }, 1000);
  }

  onUnLoad(screen) {
    screen.innerHTML = "";
  }
}

class ShowDescriptionModule extends Module {
  popupEvents = new Map();
  currentEvent;
  constructor() {
    super("Show-Description");
  }

  changeCurrentEvent(currentEvent) {
    this.currentEvent = currentEvent;
  }

  onLoad(screen) {
    screen.innerHTML =
      "<textarea class=smt-textbox id=smt-displaydescription readonly></textarea>";
    document.querySelector("#smt-displaydescription").textContent =
      this.currentEvent.description;
  }

  onUnLoad(screen) {
    screen.innerHTML = "";
  }

  setPopupEvents(popup, event) {
    this.popupEvents.set(popup, event);
  }

  moduleEvent(e) {
    document.querySelector("#smt-displaydescription").textContent =
      this.event.description;
  }
}

class WeatherModule extends Module {
  #weatherKey = "f42423bebf491b99cfbafe39a3c01e9e";
  #weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

  #requestCity;

  constructor() {
    super("Weather");
  }

  onLoad(screen) {
    screen.innerHTML = `<div id="weather-module-card">
    <img
      class="img-weather"
      id="weather-module-weathertype"
      src="./images/Weather/ludicolo.gif"
    />
    <h1 class="city-label" id="weather-module-citylabel">
      Please search for city
    </h1>
    <img
      class="img-weatherextra"
      id="weather-module-windicon"
      src="./images/Weather/wind.png"
    />
    <p
      class="p-weather-module-extra-text"
      id="weather-module-windlabel"
    >
      Wind Speed
    </p>
    <img
      class="img-weatherextra"
      id="weather-module-humidityicon"
      src="./images/Weather/humidity.png"
    />
    <p
      class="p-weather-module-extra-text"
      id="weather-module-humiditylabel"
    >
      Humidity
    </p>

    <p class="p-weather-module-extra-text"
    id="weather-module-temperaturelabel"> </p>
    </div>`;

    document
      .querySelector("#weather-module-weathertype")
      .addEventListener("click", () => {
        document.querySelector("#weather-module-humiditylabel").textContent =
          "Hello";
      });
  }

  onUnLoad(screen) {
    screen.innerHTML = "";
  }

  moduleEvent(e) {
    this.#requestCity = txtPkmKeyboard.value;
    this.getWeatherInfo();
  }

  checkResponse(response) {
    const weatherIcon = document.querySelector("#weather-module-weathertype");
    if (response.status == 404) {
      weatherIcon.src = "images/NotFound.png";
    } else {
      return response.json();
    }
  }

  async getWeatherInfo() {
    //const weatherIcon = document.querySelector("#weather-module-weathertype");
    const response = await fetch(
      this.#weatherUrl + this.#requestCity + `&appid=${this.#weatherKey}`
    );
    const data = await this.checkResponse(response);
    console.log(data);
    this.renderData(data);
  }

  renderData(data) {
    console.log(data);
    const weatherIcon = document.querySelector("#weather-module-weathertype");
    const windLabel = document.querySelector("#weather-module-windlabel");
    const humidityLabel = document.querySelector(
      "#weather-module-humiditylabel"
    );
    const temperatureLabel = document.querySelector(
      "#weather-module-temperaturelabel"
    );
    const cityLabel = document.querySelector("#weather-module-citylabel");
    console.log(`images/${data.weather[0].main.toLowerCase()}.png`);
    weatherIcon.src = `images/weather/${data.weather[0].main.toLowerCase()}.png`;
    temperatureLabel.textContent = `${data.main.temp
      .toString()
      .substring(0, 2)}°C`;
    cityLabel.textContent = `${data.name}`;
    windLabel.textContent = `Wind ${data.wind.speed}km/h`;
    humidityLabel.textContent = `Humidity ${data.main.humidity}%`;
  }
}

// *** Data ***

class DataStore {
  mapPopups = new Map();

  constructor() {}

  updatePopups(popup, popupEvent) {
    this.mapPopups.set(popup, popupEvent);
  }

  clearPopups() {
    this.mapPopups.clear();
  }

  returnPopup(popup) {
    return this.mapPopups.get(popup._wrapper);
  }
}

// *** Data ***

// ***Modules!***

class App {
  #mapPopups = new Map();
  #pokemonID = 1;
  #currentPokemon;
  #pokemonData;
  #pokemonSelected = false;
  #events = [];
  #currentModule;
  #currentDescription = "";

  #mapActive = false;
  #map;
  #mapZoomLevel = 17;
  #mapEvent;

  dataStore = new DataStore();

  constructor() {
    btnPkmSearch.addEventListener("click", this.searchPokemon.bind(this));
    btnPkmSelect.addEventListener("click", this._selectPokemon.bind(this));
    btnScreenModeText.addEventListener(
      "click",
      this._screenModeText.bind(this)
    );
    btnPkmSubmit.addEventListener("click", this._submitBtn.bind(this));
    btnScreenModeTime.addEventListener(
      "click",
      this._screenModeTime.bind(this)
    );
    btnScreenModeWeather.addEventListener(
      "click",
      this._screenModeWeather.bind(this)
    );

    txtPkmText.addEventListener("click", this.placeholderTextClear.bind(this));

    openPokedex.addEventListener("click", this._pokedexOpen.bind(this));
    closePokedex.addEventListener("click", this._pokedexClose.bind(this));
  }

  _capsFirst(word) {
    if (word === "") return;
    return word[0].toUpperCase() + word.slice(1);
  }

  _clipDescription(description) {
    if (description === "") return "";
    const desc = this._capsFirst(description);
    return desc.slice(0, 30) + "...";
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get your position");
        }
      );
  }

  flushMapPopus() {
    this.#mapPopups.clear();
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];
    this.#map = L.map("display-screen").setView(coords, this.#mapZoomLevel);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this.onMapClick.bind(this));

    this.#map.on("zoom", this._changePopupState.bind(this));

    this.dataStore.clearPopups();

    this.#events.forEach((event) => this._addNewPopup(event));
  }

  _changePopupState() {
    this.#mapZoomLevel = this.#map.getZoom();
    if (this.#mapZoomLevel <= 15) {
      this.#map.closePopup();
      console.log(this.#map);
    }

    console.log(this.#mapZoomLevel);
  }

  _clearMap() {
    this.#map.remove();
  }

  onMapClick(e) {
    this.#mapEvent = e;
    this._newEvent();
  }

  _newEvent() {
    if (this.#pokemonSelected === true) {
      const { lat, lng } = this.#mapEvent.latlng;
      const description = this.#currentDescription;
      const pokeName = this.#pokemonData.name;
      const pokeImage = this.#pokemonData.sprites.front_default;
      const event = new Encounter([lat, lng], description, pokeName, pokeImage);
      this.#events.push(event);
      this._addNewPopup(event);
    }

    if (this.#pokemonSelected === false) {
      const { lat, lng } = this.#mapEvent.latlng;
      const description = this.#currentDescription;
      const event = new NonPokemonEvent([lat, lng], description);
      this.#events.push(event);
      this._addNewPopup(event);
    }
  }

  _addNewPopup(event) {
    const popupContent = L.DomUtil.create("div", `${event.type}-popup`);
    if (event.type === "non-encounter") {
      popupContent.innerHTML = `<div id="info"><p> ${this._capsFirst(
        event.type
      )}</p><textarea id="non-encounter-textarea" readonly>${this._clipDescription(
        event.description
      )}</textarea></div>`;
    } else {
      popupContent.innerHTML = `<div id="info"><p> ${this._capsFirst(
        event.type
      )}: ${this._capsFirst(event.pokemonName)}  </p>
       <img src=${
         event.pokemonImage
       } "/> <textarea id="encounter-textarea" readonly>${this._clipDescription(
        event.description
      )}</textarea>/div>`;
    }

    const currentPopup = L.popup({
      maxWidth: 350,
      minWidth: 80,
      minHeight: 500,
      autoClose: false,
      closeOnClick: false,
      autoPan: true,
      className: `${event.type}-popup`,
    });

    L.marker(event.coords)
      .addTo(this.#map)
      .bindPopup(currentPopup)
      .setPopupContent(popupContent)
      .openPopup();

    //this.#mapPopups.set(currentPopup, event);
    this.dataStore.updatePopups(currentPopup, event);

    const eventId = this.#events.indexOf(event);

    popupContent.addEventListener("click", (e) => {
      e.stopPropagation();
      this._screenModeDescription(this.#events[eventId]);
      console.log(this.#events[eventId]);
    });
  }

  renderInfo = function (data) {
    console.log(data);
    lblPkmName.textContent = `Name: ${this._capsFirst(data.name)}`;
    lblPkmId.textContent = `Id: ${data.id}`;

    lblPkmHealth.textContent = `HP: ${data.stats[0].base_stat}`;
    lblPkmAttack.textContent = `Attack: ${data.stats[1].base_stat}`;
    lblPkmDefense.textContent = `Defense: ${data.stats[2].base_stat}`;
    lblPkmSpecAttack.textContent = `Special Attack: ${data.stats[3].base_stat}`;
    lblPkmSpeckDefense.textContent = `Special Defense: ${data.stats[4].base_stat}`;
    lblPkmSpeed.textContent = `Speed: ${data.stats[5].base_stat}`;

    displayPkm.src = data.sprites.front_default;
  };

  getPokemon = function (pokemon) {
    let url = fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
      .then((url) => {
        loader.classList.remove("hidden");
        return url.json();
      })
      .then((data) => {
        loader.classList.add("hidden");
        this.renderInfo(data);
        this._setPokemondata(data);

        return data;
      })
      .then((data) => {
        this.#pokemonID = data.id;
        for (let i = 0; i < data.abilities.length; i++) {
          console.log(data.abilities[i].ability.name);
        }
      })
      .catch((err) => {
        loader.classList.add("hidden");
        displayPkm.src = "images/NotFound.png";
      });
  };

  _submitBtn(e) {
    soundsEffects.play();
    if (this.#currentModule == null) return;
    if (this.#currentModule.name == "text") {
      this.#currentDescription = txtPkmKeyboard.value;
    }
    this.#currentModule.moduleEvent(e);
    txtPkmKeyboard.value = "";
  }

  _changeModule(module) {
    if (
      this.#currentModule != null &&
      this.#currentModule.name == "Show-Description"
    ) {
      this.#currentModule.onUnLoad(divInsideScreen);
      this.#currentModule = module;
      this.#currentModule.onLoad(divInsideScreen);
      return;
    }

    if (this.#currentModule == null) {
      this.#currentModule = module;
      this.#currentModule.onLoad(divInsideScreen);
    } else if (
      this.#currentModule != null &&
      this.#currentModule.name == module.name
    ) {
      this.#currentModule.onUnLoad(divInsideScreen);
      this.#currentModule = null;
    } else if (this.#currentModule != null) {
      this.#currentModule.onUnLoad(divInsideScreen);
      this.#currentModule = module;
      this.#currentModule.onLoad(divInsideScreen);
    }
  }

  _screenModeDescription(currentEvent) {
    soundsEffects.play();
    const showDescriptionModule = new ShowDescriptionModule();
    showDescriptionModule.changeCurrentEvent(currentEvent);
    this._changeModule(showDescriptionModule);
  }

  _screenModeWeather() {
    soundsEffects.play();
    const weatherModule = new WeatherModule();
    this._changeModule(weatherModule);
  }

  _screenModeTime() {
    soundsEffects.play();
    const timeModule = new TimeModule();

    this._changeModule(timeModule);
  }

  _screenModeText() {
    soundsEffects.play();
    const textModule = new TextModule();

    this._changeModule(textModule);
  }

  setDexDisplayVisibility(status) {
    status === false
      ? lblAll.forEach((element) => element.classList.add("hidden"))
      : lblAll.forEach((element) => element.classList.remove("hidden"));
  }

  getPokemonId() {
    return this.#pokemonID;
  }

  getMap() {
    return this.#map;
  }

  getMapActive() {
    return this.#mapActive;
  }

  // The retrieved data from the api call  for the current pokemon
  _setPokemondata(data) {
    this.#pokemonData = data;
  }

  getPokeondata() {
    return this.#pokemonData;
  }

  setMapActive(x) {
    this.#mapActive = x;
  }

  searchPokemon() {
    this.#currentPokemon = txtPkmText.value.toLowerCase();
    this.getPokemon(this.#currentPokemon);
  }

  placeholderTextClear = function () {
    txtPkmText.placeholder = "";
  };

  _selectPokemon = function () {
    if (this.#pokemonData === undefined) return;
    if (this.#pokemonSelected === false) {
      this.#pokemonSelected = true;
      soundsEffects.play();
      displayPkm.style.border = "3px solid white";
    } else {
      this.#pokemonSelected = false;
      soundsEffects.play();
      displayPkm.style.border = "";
    }
  };

  _pokedexOpen = function () {
    divPokedexTopInside.style.transform = "rotateY(180deg)";
    divPokedexTopOutside.style.transform = "rotateY(180deg)";
  };

  _pokedexClose = function () {
    divPokedexTopInside.style.transform = "";
    divPokedexTopOutside.style.transform = "";
  };
}

const app = new App();

soundsEffects.volume = 0.2;

btnPkmSearch.addEventListener("click", () => {
  let searcher = txtPkmText.value;
  soundsEffects.play();
  app.getPokemon(searcher);
});

btnRight.addEventListener("click", () => {
  soundsEffects.play();
  app.getPokemon(app.getPokemonId() + 1);
});
btnLeft.addEventListener("click", () => {
  soundsEffects.play();
  app.getPokemon(app.getPokemonId() - 1);
});
btnUp.addEventListener("click", () => {
  soundsEffects.play();
  app.getPokemon(app.getPokemonId() + 10);
});
btnDown.addEventListener("click", () => {
  soundsEffects.play();
  app.getPokemon(app.getPokemonId() - 10);
});

btnPkmMap.addEventListener("click", () => {
  soundsEffects.play();
  if (app.getMapActive() === true) return;
  app._getPosition();
  app.setMapActive(true);
  app.setDexDisplayVisibility(false);
  app.flushMapPopus();
});
btnPkmPokedex.addEventListener("click", () => {
  soundsEffects.play();
  if (app.getMapActive() === false) return;
  app._clearMap();
  app.setMapActive(false);
  app.setDexDisplayVisibility(true);
});
