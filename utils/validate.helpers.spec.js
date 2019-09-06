const { hasData } = require("../utils");

test("returns key if it exists", () => {
  expect(hasData({ phone: "613-111-1111" }, "phone")).toEqual(true);
  expect(hasData({ email: "test@example.com" }, "phone")).toEqual(false);
  expect(hasData()).toEqual(false);
  expect(hasData({})).toEqual(false);
});
