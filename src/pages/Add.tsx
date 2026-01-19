import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type FormData = {
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function AddPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (values: FormData) => {
    try {
      await axios.post("http://localhost:3000/courses", values);
      toast.success("Thêm khóa học thành công!");
      navigate("/courses"); 
    } catch (error) {
      toast.error("Thêm thất bại!");
      console.log(error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Thêm khóa học</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Tên khóa học</label>
          <input
            {...register("name", {
              required: "Tên khóa học bắt buộc",
              minLength: {
                value: 3,
                message: "Tối thiểu 3 ký tự",
              },
            })}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Số tín chỉ</label>
          <input
            type="number"
            {...register("credit", {
              required: "Số tín chỉ bắt buộc",
              min: {
                value: 1,
                message: "Số tín chỉ phải > 0",
              },
            })}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.credit && (
            <p className="text-red-500 text-sm">{errors.credit.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Danh mục</label>
          <select
            {...register("category", {
              required: "Vui lòng chọn danh mục",
            })}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="">-- Chọn danh mục --</option>
            <option value="Cơ sở">Cơ sở</option>
            <option value="Chuyên ngành">Chuyên ngành</option>
            <option value="Tự chọn">Tự chọn</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Giảng viên</label>
          <input
            {...register("teacher", {
              required: "Tên giảng viên bắt buộc",
              minLength: {
                value: 3,
                message: "Tối thiểu 3 ký tự",
              },
            })}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.teacher && (
            <p className="text-red-500 text-sm">
              {errors.teacher.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Thêm mới
        </button>
      </form>
    </div>
  );
}

export default AddPage;
