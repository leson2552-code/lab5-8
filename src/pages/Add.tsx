import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";


const courseSchema = z.object({
  name: z.string().min(3, "Tên ít nhất 3 ký tự").max(100),
  credit: z.coerce.number().min(1, "Credit > 0").max(100),
  category: z.string().min(1, "Vui lòng chọn category"),
  teacher: z.string().min(3, "Tên giáo viên ít nhất 3 ký tự"),
});

type FormValues = z.infer<typeof courseSchema>;


function AddEditPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(courseSchema),
  });

  useEffect(() => {
    if (!id) return;

    const getDetail = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/courses/${id}`
        );
        reset(data);
      } catch (error) {
        toast.error("Không tìm thấy dữ liệu");
        nav("/list");
      }
    };

    getDetail();
  }, [id]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (id) {
        await axios.put(
          `http://localhost:3000/courses/${id}`,
          values
        );
        toast.success("Cập nhật thành công");
      } else {
        await axios.post(
          "http://localhost:3000/courses",
          values
        );
        toast.success("Thêm mới thành công");
      }

      nav("/list");
    } catch (error) {
      toast.error(
        "Lỗi: " + (error as AxiosError).message
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-semibold mb-6">
        {id ? "Cập nhật khóa học" : "Thêm mới khóa học"}
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
            {...register("name")}
            type="text"
            className="w-full border px-3 py-2 rounded-lg"
          />
          <p className="text-red-500 text-sm">
            {errors.name?.message}
          </p>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Số tín chỉ
          </label>
          <input
            {...register("credit")}
            type="number"
            className="w-full border px-3 py-2 rounded-lg"
          />
          <p className="text-red-500 text-sm">
            {errors.credit?.message}
          </p>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Danh mục
          </label>
          <select
            {...register("category")}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="">-- Chọn --</option>
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
          <p className="text-red-500 text-sm">
            {errors.category?.message}
          </p>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Giảng viên
          </label>
          <input
            {...register("teacher")}
            type="text"
            className="w-full border px-3 py-2 rounded-lg"
          />
          <p className="text-red-500 text-sm">
            {errors.teacher?.message}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting
            ? "Đang xử lý..."
            : id
            ? "Cập nhật"
            : "Thêm mới"}
        </button>
      </form>
    </div>
  );
}

export default AddEditPage;
