import {ToastProvider, ToastState, useToastAction} from "@/components/providers/ToastProvider/index";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

const toastMessage = "show a toast";

const ChildComponentForShowing = () => {
  const {showToast} = useToastAction();
  return (
    <button onClick={() => showToast({message: toastMessage}) }>show</button>
  );
};

const ChildComponentForHiding = () => {
  const {hideToast} = useToastAction();
  return (
    <button onClick={() => hideToast() }>hide</button>
  );
};

test("can show the toast from child components", async () => {
  render(
    <ToastProvider>
      <ChildComponentForShowing />
    </ToastProvider>
  );
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button"));
  expect(screen.getByRole("alert")).toHaveTextContent(toastMessage);
});

test("can hide the toast from child components", async () => {
  render(
    <ToastProvider defaultState={{ isShown: true }}>
      <ChildComponentForHiding />
    </ToastProvider>
  );
  expect(screen.getByRole("alert")).toBeInTheDocument();
  await user.click(screen.getByRole("button"));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test.each<ToastState>([
  { isShown: true, message: "succeed", style: "succeed" },
  { isShown: true, message: "failed", style: "failed" },
  { isShown: true, message: "busy", style: "busy" },
])("$message", (defaultState: ToastState) => {
  render(<ToastProvider defaultState={defaultState}>{null}</ToastProvider>);
  expect(screen.getByRole("alert")).toHaveTextContent(defaultState.message);
});

