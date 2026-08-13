"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../lib/api";

import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  ArrowLeftIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

export default function DoctorsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // =========================
  // States
  // =========================

  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [error, setError] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Sort
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filters
  const [filterSpecialization, setFilterSpecialization] =
    useState("all");

  const [filterStatus, setFilterStatus] =
    useState("all");

  const [showFilters, setShowFilters] =
    useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const doctorsPerPage = 5;

  // =========================
  // Protect page
  // =========================

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // =========================
  // Fetch doctors
  // =========================

  useEffect(() => {
    if (!user) return;

    const fetchDoctors = async () => {
      try {
        setDoctorsLoading(true);
        setError("");

        const data = await apiFetch("/doctors");

        if (data.success) {
          setDoctors(data.doctors || []);
        }
      } catch (error) {
        console.error("Doctors error:", error);

        setError(
          error.message || "Failed to load doctors"
        );
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchDoctors();
  }, [user]);

  // =========================
  // Get unique specializations
  // =========================

  const specializations = [
    "all",
    ...new Set(
      doctors
        .map((doctor) => doctor.specialization)
        .filter(Boolean)
    ),
  ];

  // =========================
  // Filter + Search + Sort
  // =========================

  const filteredDoctors = doctors
    .filter((doctor) => {
      // Search
      const searchTerm = search
        .toLowerCase()
        .trim();

      if (searchTerm) {
        const matchesSearch =
          doctor.name
            ?.toLowerCase()
            .includes(searchTerm) ||
          doctor.email
            ?.toLowerCase()
            .includes(searchTerm) ||
          doctor.phone
            ?.toLowerCase()
            .includes(searchTerm) ||
          doctor.specialization
            ?.toLowerCase()
            .includes(searchTerm) ||
          doctor.hospital 
            ?.toLowerCase()
            .includes(searchTerm);

        if (!matchesSearch) {
          return false;
        }
      }

      // Specialization filter
      if (
        filterSpecialization !== "all" &&
        doctor.specialization !==
          filterSpecialization
      ) {
        return false;
      }

      // Status filter
      if (
        filterStatus === "active" &&
        !doctor.isActive
      ) {
        return false;
      }

      if (
        filterStatus === "inactive" &&
        doctor.isActive
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortField] || "";
      let bValue = b[sortField] || "";

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.ceil(
    filteredDoctors.length / doctorsPerPage
  );

  const startIndex =
    (currentPage - 1) * doctorsPerPage;

  const paginatedDoctors =
    filteredDoctors.slice(
      startIndex,
      startIndex + doctorsPerPage
    );

  // =========================
  // Reset page when search/filter changes
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    filterSpecialization,
    filterStatus,
  ]);

  // =========================
  // Handle sort
  // =========================

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(
        sortOrder === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortField(field);
      setSortOrder("asc");
    }

    setCurrentPage(1);
  };

  // =========================
  // Sort icon
  // =========================

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <ArrowUpIcon className="h-4 w-4 opacity-30" />
      );
    }

    return sortOrder === "asc" ? (
      <ArrowUpIcon className="h-4 w-4" />
    ) : (
      <ArrowDownIcon className="h-4 w-4" />
    );
  };

  // =========================
  // Clear filters
  // =========================

  const clearFilters = () => {
    setSearch("");
    setFilterSpecialization("all");
    setFilterStatus("all");
    setCurrentPage(1);
  };

  // =========================
  // Auth loading
  // =========================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Checking authentication...
          </p>
        </div>
      </main>
    );
  }

  // =========================
  // Not authenticated
  // =========================

  if (!user) {
    return null;
  }

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            Header
        ========================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard")
              }
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:scale-105 hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />

              Dashboard
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Doctors
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage and track all doctors
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/doctors/add")
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50"
          >
            <UserPlusIcon className="h-5 w-5" />

            Add Doctor
          </button>

        </div>

        {/* =========================
            Error
        ========================= */}

        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <div className="flex items-center gap-3">

              <div className="rounded-full bg-red-100 p-1">
                <XMarkIcon className="h-5 w-5" />
              </div>

              <span>{error}</span>

            </div>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="font-medium text-red-700 underline hover:text-red-900"
            >
              Retry
            </button>

          </div>
        )}

        {/* =========================
            Doctors Card
        ========================= */}

        <section className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-blue-100/20">

          {/* =========================
              Header / Search / Filters
          ========================= */}

          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-4 sm:px-6">

            <div className="flex flex-col gap-4">

              {/* Search Row */}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* Title */}

                <div>

                  <h2 className="text-lg font-semibold text-gray-900">
                    All Doctors
                  </h2>

                  <p className="mt-0.5 text-sm text-gray-500">

                    {search ||
                    filterSpecialization !==
                      "all" ||
                    filterStatus !== "all"
                      ? `${filteredDoctors.length} result${
                          filteredDoctors.length !==
                          1
                            ? "s"
                            : ""
                        } found`
                      : `${doctors.length} doctor${
                          doctors.length !==
                          1
                            ? "s"
                            : ""
                        }`}

                  </p>

                </div>

                {/* Search + Filter */}

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                  {/* Search */}

                  <div className="relative w-full sm:w-72">

                    <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                      placeholder="Search doctors..."
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearch("")
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}

                  </div>

                  {/* Filter Button */}

                  <button
                    type="button"
                    onClick={() =>
                      setShowFilters(
                        !showFilters
                      )
                    }
                    className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                      showFilters ||
                      filterSpecialization !==
                        "all" ||
                      filterStatus !== "all"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FunnelIcon className="h-4 w-4" />

                    Filters

                    {(filterSpecialization !==
                      "all" ||
                      filterStatus !==
                        "all") && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                        {
                          [
                            filterSpecialization !==
                              "all",
                            filterStatus !==
                              "all",
                          ].filter(Boolean)
                            .length
                        }
                      </span>
                    )}

                  </button>

                </div>

              </div>

              {/* =========================
                  Filters
              ========================= */}

              {showFilters && (
                <div className="grid gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-3">

                  {/* Specialization */}

                  <div>

                    <label className="mb-1.5 block text-xs font-medium text-gray-700">
                      Specialization
                    </label>

                    <select
                      value={
                        filterSpecialization
                      }
                      onChange={(e) =>
                        setFilterSpecialization(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="all">
                        All Specializations
                      </option>

                      {specializations
                        .filter(
                          (spec) =>
                            spec !== "all"
                        )
                        .map((spec) => (
                          <option
                            key={spec}
                            value={spec}
                          >
                            {spec}
                          </option>
                        ))}

                    </select>

                  </div>

                  {/* Status */}

                  <div>

                    <label className="mb-1.5 block text-xs font-medium text-gray-700">
                      Status
                    </label>

                    <select
                      value={filterStatus}
                      onChange={(e) =>
                        setFilterStatus(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="all">
                        All Status
                      </option>

                      <option value="active">
                        Active
                      </option>

                      <option value="inactive">
                        Inactive
                      </option>

                    </select>

                  </div>

                  {/* Clear */}

                  <div className="flex items-end">

                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                      Clear All Filters
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* =========================
              Loading
          ========================= */}

          {doctorsLoading ? (
            <div className="flex min-h-64 items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

                <p className="text-sm text-gray-500">
                  Loading doctors...
                </p>

              </div>

            </div>
          ) : filteredDoctors.length === 0 ? (

            /* =========================
                Empty
            ========================= */

            <div className="flex min-h-64 items-center justify-center px-6">

              <div className="max-w-md text-center">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <UserIcon className="h-8 w-8 text-gray-400" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {search ||
                  filterSpecialization !==
                    "all" ||
                  filterStatus !== "all"
                    ? "No doctors match your criteria"
                    : "No doctors found"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {search ||
                  filterSpecialization !==
                    "all" ||
                  filterStatus !== "all"
                    ? "Try adjusting your search or filters"
                    : "Start by adding your first doctor"}
                </p>

                {(search ||
                  filterSpecialization !==
                    "all" ||
                  filterStatus !==
                    "all") && (
                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Clear all filters
                  </button>
                )}

                {!search &&
                  filterSpecialization ===
                    "all" &&
                  filterStatus ===
                    "all" && (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          "/doctors/add"
                        )
                      }
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      <UserPlusIcon className="h-4 w-4" />
                      Add Doctor
                    </button>
                  )}

              </div>

            </div>
          ) : (

            /* =========================
                Table
            ========================= */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                {/* Table Header */}

                <thead>

                  <tr className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white text-left">

                    {/* Doctor */}

                    <th
                      className="cursor-pointer px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        handleSort("name")
                      }
                    >
                      <div className="flex items-center gap-1">
                        Doctor
                        {getSortIcon("name")}
                      </div>
                    </th>

                    {/* Specialization */}

                    <th
                      className="cursor-pointer px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        handleSort(
                          "specialization"
                        )
                      }
                    >
                      <div className="flex items-center gap-1">
                        Specialization
                        {getSortIcon(
                          "specialization"
                        )}
                      </div>
                    </th>

                    {/* hospital*/}

                    <th
                      className="cursor-pointer px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-700"
                      onClick={() =>
                        handleSort(
                          "hospital "
                        )
                      }
                    >
                      <div className="flex items-center gap-1">
                        hospital 
                        {getSortIcon(
                          "hospital"
                        )}
                      </div>
                    </th>

                    {/* Contact */}

                    <th className="hidden px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 lg:table-cell">
                      Contact
                    </th>

                    {/* Status */}

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    {/* Actions */}

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                {/* Table Body */}

                <tbody>

                  {paginatedDoctors.map(
                    (doctor) => (
                      <tr
                        key={doctor._id}
                        className="group border-b border-gray-100 transition hover:bg-gray-50/50"
                      >

                        {/* Doctor */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 font-semibold text-blue-700">
                              {doctor.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "D"}
                            </div>

                            <div>

                              <p className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                                {doctor.name ||
                                  "Unknown Doctor"}
                              </p>

                              <p className="max-w-[120px] truncate text-xs text-gray-400">
                                {doctor.email ||
                                  "No email"}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Specialization */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-1.5">

                            <AcademicCapIcon className="h-4 w-4 text-gray-400" />

                            <span className="text-sm text-gray-700">
                              {doctor.specialization ||
                                "—"}
                            </span>

                          </div>

                        </td>

                        {/* hospital*/}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-1.5">

                            <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />

                            <span className="text-sm text-gray-700">
                              {doctor.hospital  ||
                                "—"}
                            </span>

                          </div>

                        </td>

                        {/* Contact */}

                        <td className="hidden px-6 py-4 lg:table-cell">

                          <div className="space-y-1">

                            <div className="flex items-center gap-1.5 text-sm text-gray-600">

                              <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />

                              {doctor.phone ||
                                "—"}

                            </div>

                            <div className="flex items-center gap-1.5 text-sm text-gray-600">

                              <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400" />

                              {doctor.email ||
                                "—"}

                            </div>

                          </div>

                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">

                          {doctor.isActive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">

                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />

                              Active

                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">

                              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />

                              Inactive

                            </span>
                          )}

                        </td>

                        {/* Actions */}

                        <td className="px-6 py-4 text-right">

                          <div className="flex items-center justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/doctors/${doctor._id}`
                                )
                              }
                              className="rounded-lg px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                            >
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/doctors/${doctor._id}/edit`
                                )
                              }
                              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                            >
                              Edit
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

              {/* =========================
                  Pagination
              ========================= */}

              {totalPages > 1 && (
                <div className="flex flex-col gap-4 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                  {/* Showing */}

                  <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-medium text-gray-700">
                      {startIndex + 1}
                    </span>
                    {" – "}
                    <span className="font-medium text-gray-700">
                      {Math.min(
                        startIndex +
                          doctorsPerPage,
                        filteredDoctors.length
                      )}
                    </span>
                    {" of "}
                    <span className="font-medium text-gray-700">
                      {filteredDoctors.length}
                    </span>
                    {" doctors"}
                  </p>

                  {/* Buttons */}

                  <div className="flex items-center gap-2">

                    {/* Previous */}

                    <button
                      type="button"
                      disabled={
                        currentPage === 1
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) => page - 1
                        )
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ← Previous
                    </button>

                    {/* Page */}

                    <span className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white">
                      {currentPage}
                    </span>

                    {/* Next */}

                    <button
                      type="button"
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) => page + 1
                        )
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next →
                    </button>

                  </div>

                </div>
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}