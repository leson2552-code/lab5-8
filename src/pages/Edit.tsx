import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

type Course = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Course>({
    id: 0,
    name: "",
    credit: 0,
    category: "",
    teacher: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/courses/${id}`
      );
      setFormData(response.data);
    } catch (error) {
      toast.error("Không tìm thấy dữ liệu");
      navigate("/list");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "credit" ? Number(value) : value,
    });
  };

  const validate = () => {
    if (formData.name.trim().length < 3) {
      toast.error("Tên phải lớn hơn 3 ký tự");
      return false;
    }

    if (formData.credit <= 0) {
      toast.error("Credit phải lớn hơn 0");
      return false;
    }

    if (formData.teacher.trim().length < 3) {
      toast.error("Tên giảng viên phải lớn hơn 3 ký tự");
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await axios.put(
        `http://localhost:3000/courses/${id}`,
        formData
      );

      toast.success("Cập nhật thành công");

      setTimeout(() => {
        navigate("/list");
      }, 1000);
    } catch (error) {
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">
        Cập nhật khóa học
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tên khóa học"
          className="w-full border px-3 py-2 rounded-lg"
        />

        <input
          type="number"
          name="credit"
          value={formData.credit}
          onChange={handleChange}
          placeholder="Số tín chỉ"
          className="w-full border px-3 py-2 rounded-lg"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg"
        >
          <option value="">-- Chọn danh mục --</option>
          <option value="Cơ sở">Cơ sở</option>
          <option value="Chuyên ngành">
            Chuyên ngành
          </option>
        </select>

        <input
          type="text"
          name="teacher"
          value={formData.teacher}
          onChange={handleChange}
          placeholder="Giảng viên"
          className="w-full border px-3 py-2 rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </form>
    </div>
  );
}

export default EditPage;
