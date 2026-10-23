import { fetchEmployee, ApiError, type Employee } from "@/lib/api";

export default async function EmployeeProfile() {
  let employee: Employee | null = null;
  let errorMessage: string | null = null;

  // Only the request is inside try/catch
  try {
    employee = await fetchEmployee();
  } catch (error) {
    errorMessage =
      error instanceof ApiError
        ? "We couldn't load the profile right now. The service replied with an error."
        : "We couldn't reach the profile service. Please try again later.";
  }

  return (
    <section aria-labelledby="profile-heading" className="rounded border p-4">
      <h2 id="profile-heading" className="mb-2 text-xl font-semibold">
        Employee profile
      </h2>

      {errorMessage || !employee ? (
        <p role="alert">{errorMessage}</p>
      ) : (
        <>
          <p>
            <strong>Name:</strong> {employee.name}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Company:</strong> {employee.company.name}
          </p>
        </>
      )}
    </section>
  );
}
