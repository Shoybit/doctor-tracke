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
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

export default function DoctorDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const { user, loading } = useAuth();

  const doctorId = params?.id;

  const [doctor, setDoctor] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [error, setError] = useState("");

  // Patients
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);

  // Add patient modal
  const [showAddPatient, setShowAddPatient] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [patientError, setPatientError] =
    useState("");

  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    condition: "",
    registeredAt: "",
  });

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
  // Fetch Patients
  // =========================

  const fetchPatients = async () => {
    if (!doctorId) return;

    try {
      setPatientsLoading(true);

      const data = await apiFetch(
        `/doctors/${doctorId}/patients`
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to load patients"
        );
      }

      setPatients(data.patients || []);
    } catch (error) {
      console.error(
        "Get patients error:",
        error
      );
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !doctorId) return;

    fetchPatients();
  }, [user, doctorId]);

  // =========================
  // Patient Form Change
  // =========================

  const handlePatientChange = (e) => {
    const { name, value } = e.target;

    setPatientForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPatientError("");
  };

  // =========================
  // Add Patient
  // =========================

  const handleAddPatient = async (e) => {
    e.preventDefault();

    setPatientError("");

    if (!patientForm.name.trim()) {
      setPatientError(
        "Patient name is required."
      );
      return;
    }

    if (!patientForm.condition.trim()) {
      setPatientError(
        "Patient condition is required."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await apiFetch(
        `/doctors/${doctorId}/patients`,
        {
          method: "POST",
          body: JSON.stringify({
            name: patientForm.name.trim(),
            age:
              patientForm.age !== ""
                ? Number(patientForm.age)
                : undefined,
            gender:
              patientForm.gender || undefined,
            phone:
              patientForm.phone.trim(),
            email:
              patientForm.email.trim(),
            condition:
              patientForm.condition.trim(),
            registeredAt:
              patientForm.registeredAt ||
              undefined,
          }),
        }
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to add patient"
        );
      }

      // Reset
      setPatientForm({
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        condition: "",
        registeredAt: "",
      });

      setShowAddPatient(false);

      // Refresh patient list
      await fetchPatients();
    } catch (error) {
      console.error(
        "Add patient error:",
        error
      );

      setPatientError(
        error.message ||
          "Failed to add patient"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // Delete Patient
  // =========================

  const handleDeletePatient = async (
    patientId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmed) return;

    try {
      const data = await apiFetch(
        `/patients/${patientId}`,
        {
          method: "DELETE",
        }
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to delete patient"
        );
      }

      setPatients((prev) =>
        prev.filter(
          (patient) =>
            patient._id !== patientId
        )
      );
    } catch (error) {
      console.error(
        "Delete patient error:",
        error
      );

      alert(
        error.message ||
          "Failed to delete patient"
      );
    }
  };

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
            {error ||
              "Unable to load doctor information."}
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
                      "No hospital"}
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

          {/* Quick Stats */}

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

          {/* Contact */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <UserIcon className="h-5 w-5 text-blue-600" />
              Contact Information
            </h2>

            <div className="space-y-5">

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

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-purple-50 p-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Hospital
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {doctor.hospital || "—"}
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Professional */}

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <AcademicCapIcon className="h-5 w-5 text-purple-600" />
              Professional Information
            </h2>

            <div className="space-y-5">

              <div>
                <p className="text-xs text-gray-500">
                  Specialization
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {doctor.specialization ||
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Qualification
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {doctor.qualification ||
                    "—"}
                </p>
              </div>

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

        {/* =====================================================
            PATIENTS
        ===================================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">

          {/* Patient Header */}

          <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Patients
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Patients assigned to{" "}
                <span className="font-medium text-gray-700">
                  {doctor.name}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setPatientError("");
                setShowAddPatient(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5" />
              Add Patient
            </button>

          </div>

          {/* Patient List */}

          <div className="p-6">

            {patientsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
              </div>
            ) : patients.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
                <UserIcon className="mx-auto h-10 w-10 text-gray-300" />

                <h3 className="mt-3 text-sm font-semibold text-gray-900">
                  No patients yet
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add the first patient for this doctor.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddPatient(true)
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Patient
                </button>
              </div>
            ) : (
              <div className="space-y-4">

                {patients.map((patient) => (
                  <div
                    key={patient._id}
                    className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 hover:shadow-sm"
                  >

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                      <div className="flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                          {patient.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "P"}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {patient.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {patient.condition}
                          </p>
                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeletePatient(
                            patient._id
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>

                    </div>

                    <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">

                      <div>
                        <p className="text-xs text-gray-400">
                          Age / Gender
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {patient.age ?? "—"}
                          {patient.gender
                            ? ` / ${patient.gender}`
                            : ""}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {patient.phone ||
                            "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Email
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-700">
                          {patient.email ||
                            "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Registered
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {patient.registeredAt
                            ? new Date(
                                patient.registeredAt
                              ).toLocaleDateString(
                                "en-GB"
                              )
                            : "—"}
                        </p>
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>
        </section>
      </div>

{/* =====================================================
    ADD PATIENT MODAL
===================================================== */}

{showAddPatient && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Add Patient
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add a new patient under{" "}
            <span className="font-medium text-gray-700">
              {doctor.name}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!isSubmitting) {
              setShowAddPatient(false);
              setPatientError("");
            }
          }}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleAddPatient} className="p-5 sm:p-6">
        {patientError && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="rounded-full bg-red-100 p-1">
              <XMarkIcon className="h-4 w-4" />
            </div>
            <span>{patientError}</span>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Patient Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
  name="name"
  type="text"
  value={patientForm.name}
  onChange={handlePatientChange}
  placeholder="John Doe"
  disabled={isSubmitting}
  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm !text-black placeholder:!text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
/>
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              name="age"
              type="number"
              min="0"
              max="150"
              value={patientForm.age}
              onChange={handlePatientChange}
              placeholder="28"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={patientForm.gender}
              onChange={handlePatientChange}
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
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Phone
            </label>
            <div className="relative">
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                name="phone"
                type="tel"
                value={patientForm.phone}
                onChange={handlePatientChange}
                placeholder="+880..."
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                name="email"
                type="email"
                value={patientForm.email}
                onChange={handlePatientChange}
                placeholder="patient@example.com"
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Condition <span className="text-red-500">*</span>
            </label>
            <input
              name="condition"
              type="text"
              value={patientForm.condition}
              onChange={handlePatientChange}
              placeholder="Asthma"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Registered Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Registered Date
            </label>
            <div className="relative">
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                name="registeredAt"
                type="date"
                value={patientForm.registeredAt}
                onChange={handlePatientChange}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              setShowAddPatient(false);
              setPatientError("");
            }}
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
                Adding...
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4" />
                Add Patient
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </main>
  );
}