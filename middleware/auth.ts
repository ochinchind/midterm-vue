
import { useRouter } from 'vue-router';

export default function authMiddleware() {
  const router = useRouter();

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const part = parts.pop();
      if (part) return part.split(';').shift();
    }
    return null;
  };

  let token = null;
  try {
    token = getCookie('jwtToken');
  } catch (error) {
    console.error('localStorage or cookies are not available', error);
  }

  if (!token) {
    router.push('/');
  }
}
