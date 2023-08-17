export interface TestComponentState {
  doSomething: () => void;
}

export const useTestComponent: () => TestComponentState = () => {
  const doSomething = () => {
    console.log("Test Executed");
  };

  return { doSomething };
};
