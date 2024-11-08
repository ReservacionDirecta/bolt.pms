import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
