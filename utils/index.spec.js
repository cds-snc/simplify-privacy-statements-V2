const {
  isValidDate,
  getRouteWithIndexByName,
  getRouteByName,
  getPreviousRoute,
  getNextRoute
} = require("./index");

const testRoutes = [
  { name: "start", path: "/start" },
  { name: "personal", path: "/personal" },
  { name: "confirmation", path: "/confirmation" }
];

describe("Has valid date", () => {
  test("returns true for valid date", () => {
    expect(isValidDate("2019-01")).toBe(true);
  });

  test("returns false for bad date", () => {
    expect(isValidDate("20191-01")).toBe(false);
  });

  test("returns false for date with bad format", () => {
    expect(isValidDate("2019/01")).toBe(false);
  });

  test("returns false for date with wrong format", () => {
    expect(isValidDate("2019-01-01")).toBe(false);
  });
});

describe("Routes", () => {
  test("finds route index by name", () => {
    const obj = getRouteWithIndexByName("personal", testRoutes);
    expect(obj.index).toEqual(1);
  });

  test("finds route path by name", () => {
    const obj = getRouteByName("personal", testRoutes);
    expect(obj.path).toEqual("/personal");
  });

  test("return false for previous route that doesn't exist", () => {
    const obj = getPreviousRoute("start", testRoutes);
    expect(obj.path).toEqual(false);
  });

  test("finds previous route path by name", () => {
    const obj = getPreviousRoute("personal", testRoutes);
    expect(obj.path).toEqual("/start");
  });

  test("return false for next route that doesn't exist", () => {
    const obj = getNextRoute("confirmation", testRoutes);
    expect(obj.path).toEqual(false);
  });

  test("finds next route path by name", () => {
    const obj = getNextRoute("personal", testRoutes);
    expect(obj.path).toEqual("/confirmation");
  });
});
