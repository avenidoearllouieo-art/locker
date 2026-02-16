function AdminDashboard() {

  const lockers = [
    { id: 1, status: "Available" },
    { id: 2, status: "Occupied" },
    { id: 3, status: "Available" },
    { id: 4, status: "Maintenance" }
  ];

  return (
    <main>
      <section>
        <h2>Locker Status Overview</h2>

        <ul>
          {lockers.map(locker => (
            <li key={locker.id}>
              Locker #{locker.id} – {locker.status}
            </li>
          ))}
        </ul>

      </section>
    </main>
  );
}

export default AdminDashboard;
