// app/dashboard/_layout.tsx
import { Stack } from 'expo-router';
import DashboardFooter from '../../components/FooterDashboard';

export default function DashboardLayout() {
  return (
    <>
     

      <Stack screenOptions={{ headerShown: false }} />

      <DashboardFooter /> 
    </>
  );
}