import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

type Props = {
  isLogin?: boolean;
};

type FormValues = {
  email: string;
  password: string;
};

function AuthPage({ isLogin }: Props) {
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    try {
      if (isLogin) {
        const { data } = await axios.post(
          "http://localhost:3000/login",
          values
        );

        localStorage.setItem("accessToken", data.accessToken);
        toast.success("Đăng nhập thành công");
        reset();
        nav("/list");
      } else {
        await axios.post("http://localhost:3000/register", values);

        toast.success("Đăng ký thành công");
        reset();
        nav("/login");
      }
    } catch (error: any) {
      toast.error(error?.response?.data || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {isLogin ? "Login" : "Register"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            {...register("email", {
              required: "Email không được để trống",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email không hợp lệ",
              },
            })}
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            {...register("password", {
              required: "Password không được để trống",
              minLength: {
                value: 6,
                message: "Password tối thiểu 6 ký tự",
              },
            })}
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting
            ? "Đang xử lý..."
            : isLogin
            ? "Đăng nhập"
            : "Đăng ký"}
        </button>
      </form>

      <div className="text-center mt-4">
        {isLogin ? (
          <p>
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-blue-600 underline">
              Đăng ký
            </Link>
          </p>
        ) : (
          <p>
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-blue-600 underline">
              Đăng nhập
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
