import { useMemo, useState } from "react";
import { postJSON } from "./lib/api";
import "./App.css";

const tabs = [
  { key: "login", label: "Sign in" },
  { key: "signup", label: "Create account" },
];

const signupFields = [
  {
    name: "firstName",
    label: "First name",
    type: "text",
    autoComplete: "given-name",
  },
  {
    name: "lastName",
    label: "Last name",
    type: "text",
    autoComplete: "family-name",
  },
  {
    name: "userName",
    label: "Username",
    type: "text",
    autoComplete: "username",
  },
];

const sharedFields = [
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  {
    name: "password",
    label: "Password",
    type: "password",
    autoComplete: "current-password",
  },
];

const initialForm = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
};

function App() {
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

  const fields = useMemo(() => {
    return activeTab === "signup"
      ? [...signupFields, ...sharedFields]
      : sharedFields;
  }, [activeTab]);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setForm(initialForm);
    setMessage(null);
    setUser(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload =
      activeTab === "signup"
        ? {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            userName: form.userName.trim(),
            email: form.email.trim(),
            password: form.password,
          }
        : {
            email: form.email.trim(),
            password: form.password,
          };

    try {
      const data = await postJSON(
        activeTab === "signup" ? "/signup" : "/login",
        payload
      );

      if (data.message && !data.user) {
        setMessage({ type: "error", text: data.message });
        setUser(null);
        return;
      }

      setUser(data.user || null);
      setMessage({
        type: "success",
        text:
          activeTab === "signup"
            ? "Account created. You are signed in."
            : "Signed in successfully.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Request failed" });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12 sm:px-8">
        <header className="mb-10">
          <p className="text-sm font-semibold text-emerald-600">Auth portal</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Sign in or create an account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Simple UI on a white canvas. Requests include credentials so your
            backend can set the cookie.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === tab.key
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <label key={field.name} className="block space-y-1 text-sm">
                  <span className="text-slate-700">{field.label}</span>
                  <input
                    required
                    type={field.type}
                    name={field.name}
                    autoComplete={field.autoComplete}
                    value={form[field.name]}
                    onChange={(event) =>
                      handleChange(field.name, event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder={field.label}
                  />
                </label>
              ))}

              {message && (
                <div
                  className={`rounded-lg px-4 py-3 text-sm ${
                    message.type === "success"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? "Working..."
                  : activeTab === "signup"
                  ? "Create account"
                  : "Sign in"}
              </button>
            </form>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              What to expect
            </h2>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Minimal white layout without extra decoration.</li>
              <li>
                • Uses credentialed requests so backend sets httpOnly cookie.
              </li>
              <li>• Shows success or error responses inline.</li>
            </ul>

            {user && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <p className="font-semibold">Signed in</p>
                <p>
                  {user.firstName} {user.lastName} · {user.email}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
