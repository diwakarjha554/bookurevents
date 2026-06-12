import { Metadata } from 'next';
import Login from "@/components/auth/login";

export const metadata: Metadata = {
  title: 'Login',
  description:
    'View and manage your saved India tour packages with Tourillo Pvt Ltd. Easily access your favorite travel experiences and plan your perfect trip with personalized options at your fingertips.',
};

const page = () => {
    return (
        <Login />
    )
}

export default page;