interface Props {
  password: string;
}

const criteria = [
  { label: 'Uppercase letter', test: /[A-Z]/ },
  { label: 'Lowercase letter', test: /[a-z]/ },
  { label: 'Number', test: /[0-9]/ },
  { label: 'Special character', test: /[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/~`]/ },
];

function PasswordStrength({ password }: Props) {
  if (!password) return null;
  return (
    <ul className="password_strength">
      {criteria.map(({ label, test }) => {
        const met = test.test(password);
        return (
          <li key={label} className={met ? 'met' : 'unmet'}>
            {met ? 'v' : 'x'} {label}
          </li>
        );
      })}
    </ul>
  );
}

export default PasswordStrength;
