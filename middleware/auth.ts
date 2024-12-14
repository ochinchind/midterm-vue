
import { useRouter } from 'vue-router';

export default function authMiddleware() {
  const router = useRouter();

  const token = localStorage.getItem('jwtToken');
  if (!token) {
    router.push('/');
  }
}
