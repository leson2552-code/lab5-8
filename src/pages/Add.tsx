import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type FormInputs = {
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function AddPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
  const nav = useNavigate();

  const onSubmit: SubmitHandler<FormInputs> = async (values) => {
    try {
      await axios.post("http://localhost:3000/courses", values);
      alert("Thêm thành công!");
      nav("/list");
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
    <h1 className="text-2xl font-semibold mb-6 text-center">
      Thêm mới khóa học
    </h1>

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <label className="block mb-1 font-medium">
          Tên khóa học
        </label>
        <input
          {...register("name", {
            required: "Cần nhập tên",
            minLength: { value: 4, message: "> 3 ký tự" },
          })}
          type="text"
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Số tín chỉ
        </label>
        <input
          {...register("credit", {
            required: "Cần nhập tín chỉ",
            valueAsNumber: true,
            min: { value: 1, message: "> 0" },
          })}
          type="number"
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.credit && (
          <p className="text-red-500 text-sm mt-1">
            {errors.credit.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Giảng viên
        </label>
        <input
          {...register("teacher", {
            required: "Cần nhập tên GV",
            minLength: { value: 4, message: "> 3 ký tự" },
          })}
          type="text"
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {errors.teacher && (
          <p className="text-red-500 text-sm mt-1">
            {errors.teacher.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Danh mục
        </label>
        <select
          {...register("category", {
            required: "Vui lòng chọn danh mục",
          })}
          className="w-full border px-3 py-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">-- Chọn danh mục --</option>
          <option value="Chuyên ngành">
            Chuyên ngành
          </option>
          <option value="Cơ sở">
            Cơ sở
          </option>
          <option value="Đại cương">
            Đại cương
          </option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Thêm mới
      </button>
    </form>
  </div>
);

}

export default AddPage;