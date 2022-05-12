import React, { useState, useEffect } from "react";
import { format, getHours, addSeconds, parseJSON } from "date-fns";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import IconRefresh from "../public/assets/desktop/icon-refresh.svg";
import IconArrowDown from "../public/assets/desktop/icon-arrow-down.svg?url";
import IconArrowUp from "../public/assets/desktop/icon-arrow-up.svg?url";
import IconMoon from "../public/assets/desktop/icon-moon.svg";
import IconSun from "../public/assets/desktop/icon-sun.svg";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const serverPort = process.env.NEXT_PUBLIC_SERVER_PORT;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Home(props) {
  const [text, setText] = useState();
  const [autor, setAutor] = useState();
  const [greet, setGreet] = useState();
  const [time, setTime] = useState();
  const [hours, setHours] = useState();
  const [zone, setZone] = useState();
  const [location, setLocation] = useState();
  const [button, setButton] = useState("MORE");
  const [timezone, setTimezone] = useState();
  const [dayofWeek, setDayofWeek] = useState();
  const [dayofYear, setDayofYear] = useState();
  const [week, setWeek] = useState();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState(false);
  const [isDay, setIsDay] = useState(true);
  const [ip, setIp] = useState();

  useEffect(() => {
    setTime(new Date());
    setHours(getHours(new Date()));
    console.log(serverUrl, serverPort, apiUrl);
    getIp().then((res) => {
      getServerData(res).then(() => {
        refreshHour();
        setLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (time) {
        setTime(addSeconds(time, 1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  useEffect(() => {
    const interval = setInterval(() => {
      getServerData(ip);
    }, 900000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    refreshHour();
  }, [hours]);

  async function getServerData(res) {
    if (res) {
      await fetch(`${serverUrl}:${serverPort}/api`, {
        method: "POST",
        body: JSON.stringify({ ip: res }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setZone(`UTC${data.abbreviation}`);
          setTimezone(data.timezone);
          setDayofWeek(data.day_of_week);
          setDayofYear(data.day_of_year);
          setWeek(data.week_number);
          setTime(parseJSON(data.datetime));
          setLocation(`IN ${data.city_name}, ${data.country_name}`);
          setText(data.content);
          setAutor(data.author);
          return data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  async function getQuote() {
    return await fetch(`${serverUrl}:${serverPort}/quote`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setText(data.content);
        setAutor(data.author);
        return data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function getIp() {
    return await fetch(`${apiUrl}?format=json`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setIp(data.ip);
        return data.ip;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const refreshHour = () => {
    const hour = getHours(time);
    if (true) {
      setHours(hour);
      if (5 <= hour && hour < 12) setGreet("GOOD MORNING");
      else if (12 <= hour && hour < 18) setGreet("GOOD AFTERNOON");
      else if (18 <= hour && 0 <= hour) setGreet("GOOD EVENING");

      if (5 <= hour && hour < 18) {
        setIsDay(true);
      } else if (18 <= hour && 0 <= hour) {
        setIsDay(false);
      }
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
    getQuote(ip);
  };

  return (
    <div className={styles["section-container"]}>
      <Head>
        <title>Clock App</title>
        <meta
          name="description"
          content="Clock application that change depending on the time of day"
        />
        <link rel="icon" href="/favicon-32x32.ico" />
      </Head>

      {loading ? (
        <main className={styles["section-center-loading"]}>
          <div className={styles["sk-chase"]}>
            <div className={styles["sk-chase-dot"]}></div>
            <div className={styles["sk-chase-dot"]}></div>
            <div className={styles["sk-chase-dot"]}></div>
            <div className={styles["sk-chase-dot"]}></div>
            <div className={styles["sk-chase-dot"]}></div>
            <div className={styles["sk-chase-dot"]}></div>
          </div>
        </main>
      ) : (
        <main className={styles["section-center"]} data-visible={!info}>
          {!isDay ? <div className={styles["line-img"]}></div> : ""}
          <div
            className={styles["background-img"]}
            day-info={isDay ? "true" : "false"}
          ></div>
          <div className={styles["section-top"]} data-visible={!info}>
            <div className={styles["quote-container"]} data-visible={!info}>
              <div className={styles["quote-line"]}>
                <div className={styles["quote-text"]}>"{text}"</div>
                <button
                  type="button"
                  className={styles["quote-button"]}
                  onClick={handleRefresh}
                >
                  <IconRefresh className={styles["quote-refresh"]} />
                </button>
              </div>
              <h5 className={styles["quote-author"]}>{autor}</h5>
            </div>
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
                    {greet}
                    <span className={styles["greet-add"]}>
                      , IT&rsquo;S CURRENTLY
                    </span>
                  </h4>
                </div>

                <div className={styles["hour-box"]}>
                  <h1 className={styles["hour-text"]}>
                    {time ? format(time, "HH:mm") : ""}
                  </h1>
                  <div className={styles["hour-spec"]}>{zone}</div>
                </div>

                <div className={styles["place-box"]}>
                  <h3 className={styles["place-text"]}>{location}</h3>
                </div>
              </div>
              <div className={styles["btn-box"]}>
                <button
                  type="button"
                  className={styles["btn"]}
                  onClick={handleButton}
                >
                  <h5 className={styles["btn-text"]}>{button}</h5>
                  <span className={styles["btn-icon"]} data-visible={!info}>
                    {info ? (
                      <img
                        src={IconArrowUp}
                        className={styles["btn-image"]}
                        data-visible={!info}
                      />
                    ) : (
                      <img
                        src={IconArrowDown}
                        className={styles["btn-image"]}
                        data-visible={!info}
                      />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
          {info ? (
            <div
              className={styles["section-bottom"]}
              data-visible={!info}
              day-info={isDay ? "true" : "false"}
            >
              <div className={styles["more-information"]}>
                <div className={styles[("more-information-cell", "cell1")]}>
                  <h6 className={styles["label-top"]}>Current timezone</h6>
                  <h2 className={styles["value-top"]}>{timezone}</h2>
                </div>
                <div className={styles[("more-information-cell", "cell2")]}>
                  <h6 className={styles["label-bottom"]}>Day of the year</h6>
                  <h2 className={styles["value-bottom"]}>{dayofYear}</h2>
                </div>

                <div
                  className={styles["line"]}
                  day-info={isDay ? "true" : "false"}
                ></div>

                <div className={styles[("more-information-cell", "cell3")]}>
                  <h6 className={styles["label-top"]}>Day of the week</h6>
                  <h2 className={styles["value-top"]}>{dayofWeek}</h2>
                </div>
                <div className={styles[("more-information-cell", "cell4")]}>
                  <h6 className={styles["label-bottom"]}>Week number</h6>
                  <h2 className={styles["value-bottom"]}>{week}</h2>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </main>
      )}
    </div>
  );
}
