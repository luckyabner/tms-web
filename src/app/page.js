import { redirect } from 'next/navigation';
import { Users, UserPlus, TrendingUp, Calendar, Clock, CheckCircle, AlertTriangle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';

export default function Home() {
  redirect('/dashboard');
}
