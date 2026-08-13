"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import {
  UserGroupIcon,
  UserIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
  HeartIcon,
  ClockIcon,
  UsersIcon ,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [recentPatients, setRecentPatients] = useState([]);
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
   const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const router = useRouter();
  const { user, loading, logout } = useAuth();


  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentDateTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);
  // Protect dashboard
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Fetch dashboard statistics
useEffect(() => {
  if (!user) return;

  const fetchDashboardData = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");

      // Dashboard statistics
      const data = await apiFetch(
        `/dashboard?range=${selectedTimeRange}`
      );

      if (data.success) {
        setStats(data.stats);
      }

      // Recent patients
      const patientsData = await apiFetch(
        "/patients?page=1&limit=5"
      );

      if (patientsData.success) {
        setRecentPatients(
          patientsData.patients || []
        );
      }

      // Recent doctors
      const doctorsData = await apiFetch(
        "/doctors?page=1&limit=5"
      );

      if (doctorsData.success) {
        setRecentDoctors(
          doctorsData.doctors || []
        );
      }
    } catch (error) {
      console.error("Dashboard error:", error);

      setStatsError(
        error.message || "Failed to load dashboard data"
      );
    } finally {
      setStatsLoading(false);
    }
  };

  fetchDashboardData();
}, [user, selectedTimeRange]);
  // Checking authentication
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  // User not authenticated
  if (!user) {
    return null;
  }

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Format date
const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Statistics cards data
const statsCards = [
  {
    title: "Total Doctors",
    value: stats?.totalDoctors ?? 0,
    icon: UsersIcon,
    color: "blue",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    title: "Total Patients",
    value: stats?.totalPatients ?? 0,
    icon: UserIcon,
    color: "purple",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    title: "Avg Patients/Doctor",
    value:
      stats?.totalDoctors > 0
        ? (stats.totalPatients / stats.totalDoctors).toFixed(1)
        : "0.0",
    icon: ChartBarIcon,
    color: "green",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
  },
  {
    title: "Current Date & Time",
    value: currentDateTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    subtitle: currentDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    icon: ClockIcon,
    color: "blue",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome back,
                </span>
                <span className="text-gray-900">{user.name}</span>
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="h-4 w-px bg-gray-300" />
                <span className="flex items-center gap-1">
                  <HeartIcon className="h-4 w-4 text-red-500" />
                  <span className="capitalize">{user.role}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-600">Online</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:scale-105 hover:shadow-red-500/50"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          {statsError && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {statsError}
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                className="rounded-xl bg-gray-50 p-4 transition-all hover:scale-105 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {statsLoading ? (
                        <span className="inline-block h-8 w-16 animate-pulse rounded bg-gray-200" />
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div
                    className={`rounded-xl ${stat.bgColor} p-3 ${stat.textColor}`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Charts Section */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Patient Registration Chart */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                Patient Registrations
                </h2>
                <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="rounded-lg border border-black bg-white px-3 py-1.5 text-sm text-black font-medium focus:outline-none focus:ring-1 focus:ring-black"
                >
                <option value="week" className="text-black bg-white">Last 7 Days</option>
                <option value="month" className="text-black bg-white">Last 30 Days</option>
                <option value="year" className="text-black bg-white">Last Year</option>
                </select>
            </div>
            <div className="h-72">
              {statsLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                </div>
              ) : stats?.patientsByDate?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.patientsByDate}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
<XAxis
  dataKey="date"
  tick={{ fontSize: 12 }}
  interval={0}
  tickFormatter={(value) => {
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }}
/>
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [`${value} patients`, "Registrations"]}
                    />
                    <Legend />
                    <Line
                    type="monotone"
                    dataKey="totalPatients"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", r: 5 }}
                    name="New Patients"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Patients per Doctor Chart */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Patients per Doctor
            </h2>
            <div className="h-72">
              {statsLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
                </div>
              ) : stats?.patientsPerDoctor?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.patientsPerDoctor}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="doctorName"
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [`${value} patients`, "Patient Count"]}
                    />
                    <Legend />
                    <Bar   dataKey="totalPatients"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}>
                      {stats.patientsPerDoctor.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Patients */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Patients
              </h2>
              <button
                onClick={() => router.push("/patients")}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All →
              </button>
            </div>
            {recentPatients.length > 0 ? (
              <div className="space-y-3">
                {recentPatients.slice(0, 5).map((patient) => (
                  <div
                    key={patient._id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-all hover:border-blue-200 hover:bg-blue-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {patient.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(patient.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {patient.condition || "New"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400">
                No recent patients
              </div>
            )}
          </div>

          {/* Recent Doctors */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Doctors
              </h2>
              <button
                onClick={() => router.push("/doctors")}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View All →
              </button>
            </div>
            {recentDoctors.length > 0 ? (
              <div className="space-y-3">
                {recentDoctors.slice(0, 5).map((doctor) => (
                  <div
                    key={doctor._id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-all hover:border-purple-200 hover:bg-purple-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                        {doctor.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {doctor.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                    {doctor.patients?.length || 0} patients
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400">
                No recent doctors
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}