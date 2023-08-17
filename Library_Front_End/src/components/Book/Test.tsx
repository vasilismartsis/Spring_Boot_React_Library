import React from "react";
import TestComponent from "./TestComponent";
import { TestContext } from "./TestContext";

export default function Test() {
  return (
    <>
      <div>Test</div>
      <TestContext.Provider value={{ myName: "Bill" }}>
        <TestComponent />
      </TestContext.Provider>
    </>
  );
}
