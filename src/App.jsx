import { useState, useEffect } from "react";
import sakura from "@/animation/sakura";
import snowflake from "@/animation/snowflake";
import styles from "./App.module.less";

const AnimationList = ["sakura", "snowflake"];

function App() {
  const [current, setCurrent] = useState(AnimationList[0]);

  // 初始化全部动效
  useEffect(() => {
    sakura("sakura");
    snowflake("snowflake");
  }, []);

  // 切换动效
  function switchAnimation() {
    const length = AnimationList.length;
    const index = AnimationList.findIndex((i) => i === current);
    const nextIndex = index + 1 === length ? 0 : index + 1;
    setCurrent(AnimationList[nextIndex]);
  }

  function show(id) {
    return { display: current === id ? "" : "none" };
  }

  return (
    <div className={styles.main} onClick={switchAnimation}>
      <canvas id="sakura" style={show("sakura")} />
      <canvas id="snowflake" style={show("snowflake")} />
    </div>
  );
}

export default App;
