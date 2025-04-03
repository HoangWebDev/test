# test

# Logic Test: processWithDeplay

- Tạo hàm processWithDeplay để xử lý độ trễ giữa các lần thực thi với các params numbers, deplay và callback hàm sẽ trả về một Promise
- Trong hàm sẽ khai báo biến để theo dỗi tiến trình thực hiện
- Lập qua mảng numbers sử dụng await để chờ thời gian deplay sau đó tiến hành thực thi => Tạo độ trễ giữa các lần xử lý
- Sử dụng các biến totalNumbers:tổng số phầ tử mảng và currentNumber:số phần tử đã xử lý để truyền vào callback và theo dõi tiến trình

# App Development Test: user

- Tạo hệ thống quản lý người dùng với 100 record với các chức năng phân trang, sắp xếp và lọc
- Tạo một mô hình User với 100 record có các thông tin (id, name, balance, email, registerAt, active)
- Truy xuất dữ liệu từ file JSON để hiển thị 100 record theo dạng bảng có phân trang với các chức năng sắp xếp, lọc

* Hiển thị:

- Hiển thị 10 record mỗi trang
- Tính toán tổng số trang dựa trên số lượng record
- Tính toán trang đầu, trang cuối để trang hiện luôn nằm giữa và số trang cuối không vượt tổng số trang
- Xử các button để điều hướng các trang
- Hiển thi ngày giờ cụ thể khi hover chuột và cột registerAt

* Sắp xếp:

- Cho phép sắp xếp theo bất kỳ cột nào (name, email, registerAt, v.v.)
- Thực hiện sắp xếp theo xoay vòng: Tăng -> Giảm -> Không sắp xếp -> Tăng

* Lọc:

Lọc:

- Lọc theo các trường: name, email, active
- Áp dụng bộ lọc trước khi thực hiện phân trang
- Có thể kết hợp nhiều điều kiện lọc
