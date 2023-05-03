"use client";

import { useEffect, useState } from "react";
import { format, getHours } from "date-fns";
import styles from "./page.module.css";
import Loader from "./components/Loader";
import IconSun from "./components/IconSun";
import IconMoon from "./components/IconSun";
import IconRefresh from "./components/IconRefresh";
import IconArrowDown from "./components/IconArrowDown";
import IconArrowUp from "./components/IconArrowUp";

const serverUrl = "/api";
const apiUrl = "https://api.ipify.org/?format=json";

export default function Home() {
  const [text, setText] = useState();
  const [autor, setAutor] = useState();
  const [greet, setGreet] = useState("");
  const [time, setTime] = useState(new Date());
  const [zone, setZone] = useState("");
  const [button, setButton] = useState("MORE");
  const [timezone, setTimezone] = useState();
  const [dayofWeek, setDayofWeek] = useState();
  const [dayofYear, setDayofYear] = useState();
  const [week, setWeek] = useState();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(false);
  const [isDay, setIsDay] = useState(true);
  const [city, setCity] = useState();
  const [country, setCountry] = useState();

  useEffect(() => {
    getServerData();
    const timerId = setInterval(refreshTime, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  async function getServerData() {
    const ip = await getIp();
    if (ip) {
      const res = await fetch(`${serverUrl}/data`, {
        method: "POST",
        body: JSON.stringify({ ip: ip }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setZone(`UTC${data.abbreviation}`);
      setTimezone(data.timezone);
      setDayofWeek(data.day_of_week);
      setDayofYear(data.day_of_year);
      setWeek(data.week_number);
      setCity(data.city_name);
      setCountry(data.country_name);
      setText(data.content);
      setAutor(data.author);
      setLoading(false);
    } else {
      alert("No se pudo establecer conexión con el servidor");
    }
  }

  async function getQuote() {
    const res = await fetch(`${serverUrl}/quote`);
    const data = await res.json();
    if (!data) return;
    setText(data.content);
    setAutor(data.author);
  }

  async function getIp() {
    const res = await fetch(`${apiUrl}`);
    const data = await res.json();
    if (!data) return;
    return data.ip;
  }

  const refreshTime = () => {
    const currentTime = new Date();
    setTime(currentTime);
    const hour = getHours(currentTime);
    if (5 <= hour && hour < 12) setGreet("GOOD MORNING");
    else if (12 <= hour && hour < 18) setGreet("GOOD AFTERNOON");
    else if (18 <= hour && 0 <= hour) setGreet("GOOD EVENING");

    if (5 <= hour && hour < 18) {
      setIsDay(true);
    } else if (18 <= hour && 0 <= hour) {
      setIsDay(false);
    }
  };

  const handleButton = () => {
    if (button === "MORE") {
      setButton("LESS");
      setInfo(true);
    } else {
      setButton("MORE");
      setInfo(false);
    }
  };

  const handleRefresh = () => {
    getQuote();
  };

  return (
    <div className={styles["section-container"]}>
      <main className={styles["section-center"]} data-visible={!info}>
        {loading ? (
          <Loader />
        ) : (
          <>
            {!isDay ? <div className={styles["line-img"]}></div> : ""}
            <div
              className={styles["background-img"]}
              day-info={isDay ? "true" : "false"}
            />
            <div className={styles["section-top"]} data-visible={!info}>
              {text && autor ? (
                <div className={styles["quote-container"]} data-visible={!info}>
                  <div className={styles["quote-line"]}>
                    <div className={styles["quote-text"]}>{text}</div>
                    <button
                      type="button"
                      className={styles["quote-button"]}
                      onClick={handleRefresh}
                    >
                      <IconRefresh />
                    </button>
                  </div>
                  <h5 className={styles["quote-author"]}>{autor}</h5>
                </div>
              ) : (
                ""
              )}
              <div
                className={styles["weather-time-container"]}
                data-visible={!info}
              >
                <div className={styles["weather-time-container-info"]}>
                  <div className={styles["day-box"]}>
                    <div className={styles["icon-day-box"]}>
                      {isDay ? <IconSun /> : <IconMoon />}
                    </div>
                    <h4 className={styles["greet-text"]}>
                      {greet ? greet + ", " : ""}
                      <span className={styles["greet-add"]}>
                        IT&rsquo;S CURRENTLY
                      </span>
                    </h4>
                  </div>

                  {time ? (
                    <div className={styles["hour-box"]}>
                      <h1 className={styles["hour-text"]}>
                        {format(time, "HH:mm")}
                      </h1>
                      {zone ? (
                        <div className={styles["hour-spec"]}>{zone}</div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}

                  {city && country ? (
                    <div className={styles["place-box"]}>
                      <h3 className={styles["place-text"]}>
                        IN {city}, {country}
                      </h3>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {timezone && dayofWeek && dayofYear && week ? (
                  <div className={styles["btn-box"]}>
                    <button
                      type="button"
                      className={styles["btn"]}
                      onClick={handleButton}
                    >
                      <h5 className={styles["btn-text"]}>{button}</h5>
                      <div className={styles["btn-icon"]} data-visible={!info}>
                        {info ? (
                          <IconArrowUp info={info} />
                        ) : (
                          <IconArrowDown info={info} />
                        )}
                      </div>
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            {info ? (
              <div
                className={styles["section-bottom"]}
                data-visible={!info}
                day-info={isDay ? "true" : "false"}
              >
                <div className={styles["more-information"]}>
                  <div
                    className={`${styles["more-information-cell"]} ${styles["cell1"]}`}
                  >
                    <h6 className={styles["label-top"]}>Current timezone</h6>
                    <h2 className={styles["value-top"]}>{timezone}</h2>
                  </div>
                  <div
                    className={`${styles["more-information-cell"]} ${styles["cell2"]}`}
                  >
                    <h6 className={styles["label-bottom"]}>Day of the year</h6>
                    <h2 className={styles["value-bottom"]}>{dayofYear}</h2>
                  </div>

                  <div
                    className={styles["line"]}
                    day-info={isDay ? "true" : "false"}
                  ></div>

                  <div
                    className={`${styles["more-information-cell"]} ${styles["cell3"]}`}
                  >
                    <h6 className={styles["label-top"]}>Day of the week</h6>
                    <h2 className={styles["value-top"]}>{dayofWeek}</h2>
                  </div>
                  <div
                    className={`${styles["more-information-cell"]} ${styles["cell4"]}`}
                  >
                    <h6 className={styles["label-bottom"]}>Week number</h6>
                    <h2 className={styles["value-bottom"]}>{week}</h2>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </>
        )}
      </main>
    </div>
  );
}
