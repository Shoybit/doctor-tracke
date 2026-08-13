"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CurrencyBangladeshiIcon,
  DocumentTextIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

export default function AddDoctorPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    hospital: "",
    experience: "",
    qualification: "",
    consultationFee: "",
    bio: "",
    image: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================
  // Protect page
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
    router.replace("/login");
    return null;
  }

  // =========================
  // Input change
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Required fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.specialization.trim() ||
      !formData.hospital.trim()
    ) {
      setError(
        "Name, email, specialization and hospital  are required."
      );
      return;
    }

    // Email validation
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await apiFetch("/doctors", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          specialization:
            formData.specialization.trim(),
          hospital: formData.hospital.trim(),
          experience: formData.experience
            ? Number(formData.experience)
            : undefined,
          qualification:
            formData.qualification.trim(),
          consultationFee: formData.consultationFee
            ? Number(formData.consultationFee)
            : undefined,
          bio: formData.bio.trim(),
          image: formData.image.trim(),
        }),
      });

      if (!data.success) {
        throw new Error(
          data.message || "Failed to create doctor"
        );
      }

      setSuccess(
        "Doctor created successfully!"
      );

      // Redirect to doctors list
      setTimeout(() => {
        router.push("/doctors");
      }, 800);
    } catch (error) {
      console.error("Create doctor error:", error);

      setError(
        error.message ||
          "Failed to create doctor. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">

        {/* Header */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">

          <button
            type="button"
            onClick={() =>
              router.push("/doctors")
            }
            className="flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Doctors
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Add Doctor
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Add a new doctor to your medical practice
            </p>
          </div>

        </div>

        {/* Form Card */}

        <section className="rounded-2xl bg-white p-5 shadow-xl shadow-blue-100/20 sm:p-8">

          {/* Error */}

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =========================
                Basic Information
            ========================= */}

            <div>

              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <UserIcon className="h-5 w-5 text-blue-600" />
                Basic Information
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Name */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Doctor Name
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <div className="relative">

                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Dr. John Doe"
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                </div>

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email Address
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <div className="relative">

                    <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="doctor@example.com"
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                </div>

                {/* Phone */}

                <div>

                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>

                  <div className="relative">

                    <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+8801XXXXXXXXX"
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                </div>

                {/* Image */}

                <div>

                  <label
                    htmlFor="image"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Profile Image URL
                  </label>

                  <div className="relative">

                    <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="image"
                      name="image"
                      type="url"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/doctor.jpg"
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* =========================
                Professional Information
            ========================= */}

            <div className="border-t border-gray-100 pt-6">

              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                Professional Information
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Specialization */}

                <div>

                  <label
                    htmlFor="specialization"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Specialization
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    value={
                      formData.specialization
                    }
                    onChange={handleChange}
                    placeholder="Cardiology"
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

              
{/* hospital */}

<div>
  <label
    htmlFor="hospital"
    className="mb-2 block text-sm font-medium text-gray-700"
  >
    hospital
    <span className="text-red-500"> *</span>
  </label>

  <div className="relative">
    <BuildingOfficeIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

    <input
      id="hospital"
      name="hospital"
      type="text"
      value={formData.hospital}
      onChange={handleChange}
      placeholder="Dhaka Medical College hospital"
      disabled={isSubmitting}
      className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
    />
  </div>
</div>

                {/* Experience */}

                <div>

                  <label
                    htmlFor="experience"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Experience (Years)
                  </label>

                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    value={
                      formData.experience
                    }
                    onChange={handleChange}
                    placeholder="10"
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

                {/* Qualification */}

                <div>

                  <label
                    htmlFor="qualification"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Qualification
                  </label>

                  <input
                    id="qualification"
                    name="qualification"
                    type="text"
                    value={
                      formData.qualification
                    }
                    onChange={handleChange}
                    placeholder="MBBS, FCPS"
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                </div>

                {/* Consultation Fee */}

                <div>

                  <label
                    htmlFor="consultationFee"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Consultation Fee
                  </label>

                  <div className="relative">

                    <CurrencyBangladeshiIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      id="consultationFee"
                      name="consultationFee"
                      type="number"
                      min="0"
                      value={
                        formData.consultationFee
                      }
                      onChange={handleChange}
                      placeholder="1000"
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* =========================
                Bio
            ========================= */}

            <div className="border-t border-gray-100 pt-6">

              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                Additional Information
              </h2>

              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Bio
              </label>

              <textarea
                id="bio"
                name="bio"
                rows={5}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write a short description about the doctor..."
                disabled={isSubmitting}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              />

            </div>

            {/* =========================
                Buttons
            ========================= */}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  router.push("/doctors")
                }
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01] hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Creating Doctor..."
                  : "Create Doctor"}
              </button>

            </div>

          </form>

        </section>

      </div>
    </main>
  );
}