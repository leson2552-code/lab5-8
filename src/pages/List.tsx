import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


type Course = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function ListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();


  const itemsPerPage = 3;

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/courses"
      );
      setCourses(response.data);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa không?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/courses/${id}`);

      const updatedCourses = courses.filter(
        (course) => course.id !== id
      );
      setCourses(updatedCourses);

      toast.success("Xóa thành công");

      const newTotalPages = Math.ceil(
        updatedCourses.length / itemsPerPage
      );
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages || 1);
      }
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  const filteredCourses = courses.filter((course) => {
    return (
      course.name.toLowerCase().includes(search.toLowerCase()) &&
      (teacherFilter === "" ||
        course.teacher === teacherFilter)
    );
  });

  const totalPages = Math.ceil(
    filteredCourses.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const teachers = [
    ...new Set(courses.map((c) => c.teacher)),
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Danh sách khóa học
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-lg"
        />

        <select
          value={teacherFilter}
          onChange={(e) => {
            setTeacherFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">
            -- Lọc theo giảng viên --
          </option>
          {teachers.map((teacher) => (
            <option key={teacher} value={teacher}>
              {teacher}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Teacher</th>
              <th className="px-4 py-2 border">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {currentCourses.map((course) => (
              <tr
                key={course.id}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-2 border">
                  {course.id}
                </td>
                <td className="px-4 py-2 border">
                  {course.name}
                </td>
                <td className="px-4 py-2 border">
                  {course.teacher}
                </td>
                <td className="px-4 py-2 border space-x-3">
                  <button
                    onClick={() => navigate(`/edit/${course.id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>


                  <button
                    onClick={() =>
                      handleDelete(course.id)
                    }
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {currentCourses.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-4"
                >
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {Array.from(
          { length: totalPages },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() =>
                setCurrentPage(index + 1)
              }
              className={`px-3 py-1 rounded ${currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
                }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default ListPage;
