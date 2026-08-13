"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserPlusIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

export default function PatientsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const limit = 10;

  // =========================
  // Protect Page
  // =========================

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // =========================
  // Fetch Patients
  // =========================

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (condition.trim()) {
        params.set("condition", condition.trim());
      }

      if (startDate) {
        params.set("startDate", startDate);
      }

      if (endDate) {
        params.set("endDate", endDate);
      }

      params.set("page", page);
      params.set("limit", limit);

      const data = await apiFetch(`/patients?${params.toString()}`);

      if (!data.success) {
        throw new Error(data.message || "Failed to load patients");
      }

      setPatients(data.patients || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error("Fetch patients error:", error);
      setError(error.message || "Failed to load patients");
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchPatients();
  }, [user, page, search, condition, startDate, endDate]);

  // =========================
  // Reset Filters
  // =========================

  const resetFilters = () => {
    setSearch("");
    setCondition("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  // =========================
  // Delete Patient
  // =========================

  const handleDelete = async (patient) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.name}?`
    );

    if (!confirmed) return;

    try {
      const data = await apiFetch(`/patients/${patient._id}`, {
        method: "DELETE",
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to delete patient");
      }

      await fetchPatients();
    } catch (error) {
      console.error("Delete patient error:", error);
      setError(error.message || "Failed to delete patient");
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-gray-500">Checking authentication...</p>
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
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:scale-105"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Dashboard
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Patients
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all registered patients
              </p>
            </div>
          </div>


        </div>

        {/* Error */}
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
              onClick={() => window.location.reload()}
              className="font-medium text-red-700 underline hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <section className="mb-6 rounded-2xl bg-white shadow-xl shadow-blue-100/20">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <FunnelIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Search & Filters</h2>
                  {(search || condition || startDate || endDate) && (
                    <p className="text-xs text-gray-400">
                      Active filters applied
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  showFilters || search || condition || startDate || endDate
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FunnelIcon className="h-4 w-4" />
                Filters
                {(search || condition || startDate || endDate) && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                    {[search, condition, startDate, endDate].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Search */}
                <div className="lg:col-span-1">
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <MagnifyingGlassIcon className="h-3.5 w-3.5" />
                      Search
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Name, email or phone..."
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <HeartIcon className="h-3.5 w-3.5" />
                      Condition
                    </div>
                  </label>
                  <input
                    type="text"
                    value={condition}
                    onChange={(e) => {
                      setCondition(e.target.value);
                      setPage(1);
                    }}
                    placeholder="e.g. Fever, Diabetes"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      From Date
                    </div>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      To Date
                    </div>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Reset */}
              {(search || condition || startDate || endDate) && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Patient Table */}
        <section className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-blue-100/20">
          {/* Table Header */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Patient Records
                </h2>
                {pagination && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    {pagination.totalPatients} total patients
                  </p>
                )}
              </div>
              {!loadingPatients && patients.length > 0 && (
                <span className="text-xs text-gray-400">
                  Showing {patients.length} of {pagination?.totalPatients || 0}
                </span>
              )}
            </div>
          </div>

          {loadingPatients ? (
            <div className="flex h-80 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                <p className="text-sm text-gray-500">Loading patients...</p>
              </div>
            </div>
          ) : patients.length === 0 ? (
            <div className="flex h-80 items-center justify-center">
              <div className="text-center max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <UserGroupIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {search || condition || startDate || endDate
                    ? "No patients match your criteria"
                    : "No patients found"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {search || condition || startDate || endDate
                    ? "Try adjusting your search or filters"
                    : "Start by adding your first patient"}
                </p>
                {(search || condition || startDate || endDate) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Clear all filters
                  </button>
                )}
                {!search && !condition && !startDate && !endDate && (
                  <button
                    type="button"
                    onClick={() => router.push("/patients/add")}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    <UserPlusIcon className="h-4 w-4" />
                    Add Patient
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Patient
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Age / Gender
                      </th>
                      <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 xl:table-cell">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Condition
                      </th>
                      <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 md:table-cell">
                        Doctor
                      </th>
                      <th className="hidden px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 lg:table-cell">
                        Registered
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {patients.map((patient) => (
                      <tr
                        key={patient._id}
                        className="transition hover:bg-gray-50/70 group"
                      >
                        {/* Patient */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 font-semibold text-blue-700">
                              {patient.name?.charAt(0)?.toUpperCase() || "P"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {patient.name || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-400 truncate max-w-[120px]">
                                {patient.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Age / Gender */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {patient.age ?? "—"}
                          </p>
                          <p className="mt-0.5 text-xs capitalize text-gray-500">
                            {patient.gender || "—"}
                          </p>
                        </td>

                        {/* Contact */}
                        <td className="hidden px-6 py-4 xl:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />
                              {patient.phone || "—"}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400" />
                              {patient.email || "—"}
                            </div>
                          </div>
                        </td>

                        {/* Condition */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getConditionColor(
                              patient.condition
                            )}`}
                          >
                            {patient.condition || "—"}
                          </span>
                        </td>

                        {/* Doctor */}
                        <td className="hidden px-6 py-4 md:table-cell">
                          <p className="text-sm font-medium text-gray-900">
                            {patient.doctor?.name || "—"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {patient.doctor?.specialization || ""}
                          </p>
                        </td>

                        {/* Registered */}
                        <td className="hidden px-6 py-4 lg:table-cell">
                          <p className="text-sm text-gray-600">
                            {patient.registeredAt
                              ? new Date(patient.registeredAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(`/patients/${patient._id}/edit`)
                              }
                              className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                              title="Edit"
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(patient)}
                              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                              title="Delete"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-3 p-4 lg:hidden">
                {patients.map((patient) => (
                  <div
                    key={patient._id}
                    className="rounded-xl border border-gray-100 p-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 font-semibold text-blue-700">
                          {patient.name?.charAt(0)?.toUpperCase() || "P"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {patient.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {patient.email || "No email"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${getConditionColor(
                          patient.condition
                        )}`}
                      >
                        {patient.condition || "—"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-400">Age / Gender</p>
                        <p className="mt-1 text-gray-700">
                          {patient.age ?? "—"} /{" "}
                          <span className="capitalize">{patient.gender || "—"}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Doctor</p>
                        <p className="mt-1 text-gray-700">
                          {patient.doctor?.name || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="mt-1 text-gray-700">{patient.phone || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Registered</p>
                        <p className="mt-1 text-gray-700">
                          {patient.registeredAt
                            ? new Date(patient.registeredAt).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/patients/${patient._id}/edit`)
                        }
                        className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(patient)}
                        className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 0 && (
            <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Page{" "}
                <span className="font-medium text-gray-900">
                  {pagination.currentPage}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {pagination.totalPages}
                </span>
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
                  .filter((pageNumber) => {
                    if (pagination.totalPages <= 7) return true;
                    return (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      Math.abs(pageNumber - pagination.currentPage) <= 1
                    );
                  })
                  .map((pageNumber, index, array) => (
                    <div key={pageNumber} className="flex items-center">
                      {index > 0 && pageNumber - array[index - 1] > 1 && (
                        <span className="px-1 text-gray-400">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                          pagination.currentPage === pageNumber
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    </div>
                  ))}

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}