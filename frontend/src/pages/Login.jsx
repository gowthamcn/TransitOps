import LoginBanner from "../components/login/LoginBanner";
import LoginForm from "../components/login/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full top-10 -left-20"></div>

      <div className="absolute w-96 h-96 bg-blue-600/20 blur-3xl rounded-full bottom-10 -right-20"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl bg-slate-900/80 backdrop-blur-xl grid lg:grid-cols-2 border border-slate-800">

        <LoginBanner />

        <LoginForm />

      </div>

    </div>
  );
};

export default Login;