const calculatePasswordStrength = (value) => {
  console.log(`Pwd check with value: ${value}`);
  console.log(value);
  let strength = 0;
  if (value.match(/[\p{Ll}]+/u)) {
    strength += 1;
  }
  if (value.match(/\p{Lu}/u)) {
    strength += 1;
  }
  if (value.match(/[0-9]/)) {
    strength += 1;
  }
  if (value.match(/[`~!@#$%^&*()\-_=+{}[\]\\|;:'",<.>/?]+/)) {
    strength += 1;
  }
  return strength;
};

export default calculatePasswordStrength;
