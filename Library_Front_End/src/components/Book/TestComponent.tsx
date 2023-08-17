import React from "react";
import { useTestComponent } from "./useTestComponent";
import { Button } from "antd";

export default function TestComponent() {
  const { doSomething } = useTestComponent();

  return (
    <>
      <Button onClick={doSomething}>Test Button</Button>
    </>
  );
}
