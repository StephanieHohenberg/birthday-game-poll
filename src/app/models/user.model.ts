export class User {
  id: string;
  name: string;
  isDrinking: boolean;
}

export function mapUsertoString(user: {name, isDrinking}): string {
  const flag = user.isDrinking ? 1 : 0;
  return `${flag}${user.name}`;
}

export function mapStringToUser(cookieString: string) {
  const flag = cookieString.charAt(0);
  const isDrinking = flag === '1';
  const name = cookieString.substr(1);
  return {name, isDrinking};
}
