function triangleCalculator(a, b, c) {
  a = parseFloat(a);
  b = parseFloat(b);
  c = parseFloat(c);
  let out = "";

  if (!Number.isInteger(a) || !Number.isInteger(b) || !Number.isInteger(c)) {
    return "Value is not an integer";
  } else if (a <= 0 || a > 200 || b <= 0 || b > 200 || c <= 0 || c > 200) {
    return "Value is out of range";
  }

  // Check triangle possibility 
  if (a + b <= c || a + c <= b || b + c <= a) {
    out = "Not a triangle";
  }

  //Check triangle type
  else if (a == b && b == c) {
    out = "Equilateral";
  } else if (a == b || a == c || b == c) {
    out = "Isosceles";
  } else {
    out = "Scalene";
  }
  return out;
}
