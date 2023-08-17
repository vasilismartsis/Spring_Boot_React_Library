import { createContext } from "react";
import { Book } from "./types";
import { SorterResult } from "antd/es/table/interface";

interface TestContextValue {
myName: string;
}

export const TestContext = createContext<TestContextValue>({
  myName: "babis",
});
