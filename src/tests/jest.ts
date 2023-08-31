const original = window.location;

export function mockWindowLocationReload() {
  Object.defineProperty(window, "location", {
    writable: true,
    value: { reload: jest.fn() },
  });
  const cleanup = () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: original,
    });
  };
  return cleanup;
}
