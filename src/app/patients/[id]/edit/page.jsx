"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../context/AuthContext";

import {
  ArrowLeftIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  PencilSquareIcon,
  XMarkIcon,
  CheckCircleIcon,
  UserGroupIcon,
  HeartIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();

  const { user, loading } = useAuth();

  const patientId = params?.id;

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    condition: "",
    registeredAt: "",
  });

  const [patient, setPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // Protect Page
  // =========================

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // =========================
  // Fetch Patient
  // =========================

  useEffect(() => {
    if (!user || !patientId) return;

    const fetchPatient = async () => {
      try {
        setLoadingPatient(true);
        setError("");

        const data = await apiFetch(`/patients?limit=1000`);

        if (!data.success) {
          throw new Error(data.message || "Failed to load patient");
        }

        const foundPatient = data.patients?.find((item) => item._id === patientId);

        if (!foundPatient) {
          throw new Error("Patient not found");
        }

        setPatient(foundPatient);

        setFormData({
          name: foundPatient.name || "",
          age: foundPatient.age !== undefined && foundPatient.age !== null ? String(foundPatient.age) : "",
          gender: foundPatient.gender || "",
          phone: foundPatient.phone || "",
          email: foundPatient.email || "",
          condition: foundPatient.condition || "",
          registeredAt: foundPatient.registeredAt
            ? new Date(foundPatient.registeredAt).toISOString().split("T")[0]
            : "",
        });
      } catch (error) {
        console.error("Fetch patient error:", error);
        setError(error.message || "Failed to load patient");
      } finally {
        setLoadingPatient(false);
      }
    };

    fetchPatient();
  }, [user, patientId]);

  // =========================
  // Handle Change
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Patient name is required.");
      return;
    }

    if (!formData.condition.trim()) {
      setError("Patient condition is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await apiFetch(`/patients/${patientId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: formData.name.trim(),
          age: formData.age !== "" ? Number(formData.age) : undefined,
          gender: formData.gender || undefined,
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          condition: formData.condition.trim(),
          registeredAt: formData.registeredAt || undefined,
        }),
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to update patient");
      }

      setSuccess("Patient updated successfully.");

      setTimeout(() => {
        router.push("/patients");
      }, 800);
    } catch (error) {
      console.error("Update patient error:", error);
      setError(error.message || "Failed to update patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // Get condition color
  // =========================

  const getConditionColor = (condition) => {
    const colors = {
      stable: "bg-green-100 text-green-700",
      critical: "bg-red-100 text-red-700",
      improving: "bg-blue-100 text-blue-700",
      fever: "bg-orange-100 text-orange-700",
      diabetes: "bg-purple-100 text-purple-700",
      hypertension: "bg-pink-100 text-pink-700",
    };
    return colors[condition?.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  // =========================
  // Loading
  // =========================

  if (loading || loadingPatient) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-gray-500">Loading patient...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/patients")}
            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:scale-105"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Patients
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
              <PencilSquareIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Edit Patient
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Update patient information
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-1">
                <XMarkIcon className="h-5 w-5" />
              </div>
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-700 hover:text-red-900"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-1">
                <CheckCircleIcon className="h-5 w-5" />
              </div>
              <span>{success}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccess("")}
              className="text-green-700 hover:text-green-900"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white shadow-xl shadow-blue-100/20 overflow-hidden">
          {/* Form Header */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <UserGroupIcon className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Patient Information
                </h2>
              </div>
              {patient?.doctor && (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm">
                  <AcademicCapIcon className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-600">
                    Doctor: <span className="font-medium text-gray-900">{patient.doctor.name}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="sm:col-span-2">
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Enter patient name"
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  max="150"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Enter age"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="" className="text-gray-900">Select gender</option>
                  <option value="male" className="text-gray-900">Male</option>
                  <option value="female" className="text-gray-900">Female</option>
                  <option value="other" className="text-gray-900">Other</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="relative">
                  <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Enter email address"
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="mb-1.5 block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <HeartIcon className="h-4 w-4" />
                    Condition <span className="text-red-500">*</span>
                  </div>
                </label>
                <input
                  id="condition"
                  name="condition"
                  type="text"
                  value={formData.condition}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. Fever, Diabetes"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Registered Date */}
              <div>
                <label htmlFor="registeredAt" className="mb-1.5 block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4" />
                    Registered Date
                  </div>
                </label>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    id="registeredAt"
                    name="registeredAt"
                    type="date"
                    value={formData.registeredAt}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Current Info Card (if patient exists) */}
            {patient && (
              <div className="mt-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/50 p-4">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Current:</span>
                    <span className="font-medium text-gray-900">{patient.name}</span>
                  </div>
                  <div className="h-4 w-px bg-gray-300" />
                  <div className="flex items-center gap-2">
                    <HeartIcon className="h-4 w-4 text-gray-400" />
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getConditionColor(patient.condition)}`}>
                      {patient.condition || "—"}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-gray-300" />
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      Registered: {patient.registeredAt ? new Date(patient.registeredAt).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/patients")}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60 ${
                  isSubmitting ? "cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <PencilSquareIcon className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}