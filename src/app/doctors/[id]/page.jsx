"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { apiFetch } from "../../../lib/api";

import {
  ArrowLeftIcon,
  PencilSquareIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CurrencyBangladeshiIcon,
  BriefcaseIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function DoctorDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const { user, loading } = useAuth();

  const doctorId = params?.id;

  const [doctor, setDoctor] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Protect page
  // =========================

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // =========================
  // Fetch Doctor
  // =========================

  useEffect(() => {
    if (!user || !doctorId) return;

    const fetchDoctor = async () => {
      try {
        setDoctorLoading(true);
        setError("");

        const data = await apiFetch(
          `/doctors/${doctorId}`
        );

        if (!data.success || !data.doctor) {
          throw new Error(
            data.message || "Doctor not found"
          );
        }

        setDoctor(data.doctor);
      } catch (error) {
        console.error(
          "Get doctor error:",
          error
        );

        setError(
          error.message ||
            "Failed to load doctor"
        );
      } finally {
        setDoctorLoading(false);
      }
    };

    fetchDoctor();
  }, [user, doctorId]);

  // =========================
  // Authentication Loading
  // =========================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Checking authentication...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  // =========================
  // Doctor Loading
  // =========================

  if (doctorLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Loading doctor...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // Error
  // =========================

  if (error || !doctor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <UserIcon className="h-8 w-8 text-red-500" />
          </div>

          <h1 className="text-xl font-bold text-gray-900">
            Doctor Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || "Unable to load doctor information."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/doctors")
            }
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Doctors
          </button>

        </div>
      </main>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">

        {/* =========================
            Header
        ========================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                router.push("/doctors")
              }
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Doctors
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Doctor Details
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View doctor information
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/doctors/${doctor._id}/edit`
              )
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
          >
            <PencilSquareIcon className="h-5 w-5" />
            Edit Doctor
          </button>

        </div>

        {/* =========================
            Profile Header
        ========================= */}

        <section className="mb-6 overflow-hidden rounded-2xl bg-white shadow-xl shadow-blue-100/20">

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8">

            <div className="flex flex-col items-center gap-5 sm:flex-row">

              {/* Profile Image */}

              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-24 w-24 rounded-full border-4 border-white/80 object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/80 bg-white text-3xl font-bold text-blue-600 shadow-lg">
                  {doctor.name
                    ?.charAt(0)
                    ?.toUpperCase() || "D"}
                </div>
              )}

              {/* Name */}

              <div className="text-center text-white sm:text-left">

                <h2 className="text-2xl font-bold">
                  {doctor.name}
                </h2>

                <p className="mt-1 text-blue-100">
                  {doctor.specialization ||
                    "Doctor"}
                </p>

                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">

                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                    {doctor.hospital ||
                      "No hospital "}
                  </span>

                  {doctor.isActive ? (
                    <span className="rounded-full bg-green-400/20 px-3 py-1 text-xs font-medium text-green-100">
                      ● Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                      ● Inactive
                    </span>
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* =========================
              Quick Stats
          ========================= */}

          <div className="grid border-b border-gray-100 sm:grid-cols-3">

            <div className="border-b border-gray-100 p-5 text-center sm:border-b-0 sm:border-r">
              <BriefcaseIcon className="mx-auto h-6 w-6 text-blue-500" />

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {doctor.experience ?? 0}
              </p>

              <p className="text-sm text-gray-500">
                Years Experience
              </p>
            </div>

            <div className="border-b border-gray-100 p-5 text-center sm:border-b-0 sm:border-r">
              <CurrencyBangladeshiIcon className="mx-auto h-6 w-6 text-green-500" />

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {doctor.consultationFee
                  ? `৳${doctor.consultationFee}`
                  : "—"}
              </p>

              <p className="text-sm text-gray-500">
                Consultation Fee
              </p>
            </div>

            <div className="p-5 text-center">
              <AcademicCapIcon className="mx-auto h-6 w-6 text-purple-500" />

              <p className="mt-2 truncate px-2 text-lg font-bold text-gray-900">
                {doctor.qualification ||
                  "—"}
              </p>

              <p className="text-sm text-gray-500">
                Qualification
              </p>
            </div>

          </div>

        </section>

        {/* =========================
            Information
        ========================= */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Contact Information */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <UserIcon className="h-5 w-5 text-blue-600" />
              Contact Information
            </h2>

            <div className="space-y-5">

              {/* Email */}

              <div className="flex items-start gap-3">

                <div className="rounded-lg bg-blue-50 p-2">
                  <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Email
                  </p>

                  <p className="mt-1 break-all font-medium text-gray-900">
                    {doctor.email || "—"}
                  </p>
                </div>

              </div>

              {/* Phone */}

              <div className="flex items-start gap-3">

                <div className="rounded-lg bg-green-50 p-2">
                  <PhoneIcon className="h-5 w-5 text-green-600" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Phone
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {doctor.phone || "—"}
                  </p>
                </div>

              </div>

              {/* hospital  */}

              <div className="flex items-start gap-3">

                <div className="rounded-lg bg-purple-50 p-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    hospital 
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {doctor.hospital  || "—"}
                  </p>
                </div>

              </div>

            </div>

          </section>

          {/* Professional Information */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <AcademicCapIcon className="h-5 w-5 text-purple-600" />
              Professional Information
            </h2>

            <div className="space-y-5">

              {/* Specialization */}

              <div>

                <p className="text-xs text-gray-500">
                  Specialization
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {doctor.specialization ||
                    "—"}
                </p>

              </div>

              {/* Qualification */}

              <div>

                <p className="text-xs text-gray-500">
                  Qualification
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {doctor.qualification ||
                    "—"}
                </p>

              </div>

              {/* Experience */}

              <div>

                <p className="text-xs text-gray-500">
                  Experience
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {doctor.experience !==
                  undefined &&
                  doctor.experience !==
                    null
                    ? `${doctor.experience} years`
                    : "—"}
                </p>

              </div>

            </div>

          </section>

        </div>

        {/* =========================
            Bio
        ========================= */}

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
            About Doctor
          </h2>

          <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
            {doctor.bio ||
              "No biography has been provided for this doctor."}
          </p>

        </section>

      </div>
    </main>
  );
}