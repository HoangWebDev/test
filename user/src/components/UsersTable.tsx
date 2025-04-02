import { useEffect, useMemo, useState } from "react";
import { TUser } from "../interfaces/User";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatBalance, formatDate, formatDetailedDate } from "../utils/format";

interface UsersTableProps {
    darkMode: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
    field: keyof TUser | null;
    direction: SortDirection;
}


function UsersTable({ darkMode }: UsersTableProps) {
    // Trạng thái cho dữ liệu người dùng
    const [users, setUsers] = useState<TUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Trạng thái cho phân trang
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsPerPage] = useState<number>(10);

    // Trạng thái cho sắp xếp
    const [sortState, setSortState] = useState<SortState>({
        field: null,
        direction: null
    });

    // Trạng thái cho lọc
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        status: ''
    });

    // Lấy dữ liệu từ file JSON
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                // Sử dụng fetch để lấy dữ liệu từ file JSON của bạn
                const response = await fetch('/data/users.json');
                if (!response.ok) {
                    throw new Error('Không thể tải dữ liệu người dùng');
                }

                const data = await response.json();

                // Chuyển đổi chuỗi registerAt thành đối tượng Date
                const formattedData = data.map((user: TUser) => ({
                    ...user,
                    registerAt: new Date(user.registerAt)
                }));

                setUsers(formattedData);
            } catch (err) {
                setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
                console.error('Error: ', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Xử lý sắp xếp khi nhấp vào tiêu đề cột
    const handleSort = (field: keyof TUser) => {
        setSortState(prev => {
            if (prev.field === field) {
                // Xoay vòng: asc -> desc -> null
                return {
                    field,
                    direction: prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc'
                };
            }
            return { field, direction: 'asc' };
        });
    };

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1); // Reset về trang đầu tiên khi lọc
    };

    // Áp dụng lọc và sắp xếp cho dữ liệu
    const filteredAndSortedUsers = useMemo(() => {
        let result = [...users];

        // Lọc theo tên
        if (filters.name) {
            result = result.filter(user =>
                user.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        // Lọc theo email
        if (filters.email) {
            result = result.filter(user =>
                user.email.toLowerCase().includes(filters.email.toLowerCase())
            );
        }

        // Lọc theo trạng thái
        if (filters.status) {
            result = result.filter(user =>
                filters.status === 'active' ? user.active : !user.active
            );
        }

        // Áp dụng sắp xếp
        if (sortState.field && sortState.direction) {
            result.sort((a, b) => {
                //Lấy giá trị trường từ user cần sắp xếp
                let valueA = a[sortState.field as keyof TUser];
                let valueB = b[sortState.field as keyof TUser];

                // Xử lý date thành milliseconds 
                if (sortState.field === 'registerAt') {
                    valueA = (valueA as Date).getTime();
                    valueB = (valueB as Date).getTime();
                }

                // Xử lý giá trị boolean thành 1 và 0
                if (typeof valueA === 'boolean') {
                    valueA = valueA ? 1 : 0;
                    valueB = valueB ? 1 : 0;
                }

                //So sánh giá trị tăng thì -1 tương đương nhỏ lên trước
                if (valueA < valueB) {
                    return sortState.direction === 'asc' ? -1 : 1;
                }

                //So sánh giá trị giam thì 1 tương đương lớn lên trước
                if (valueA > valueB) {
                    return sortState.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        // Trả về mảng mới đã sắp xếp
        return result;
    }, [users, sortState, filters]);

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredAndSortedUsers.length / rowsPerPage);
    const totalUsers = filteredAndSortedUsers.length;

    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return filteredAndSortedUsers.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredAndSortedUsers, currentPage, rowsPerPage]);

    // Render phân trang
    const renderPagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        //Trang hiện tại sẽ không nhỏ hơn một và luôn nằm giữa vì số trang hiện thị là maxVisiblePages = 5
        let startPage = Math.max(1, currentPage - 2);

        // Trang cuối cùng sẽ không vượt qua tổng số trang là totalPages
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        //Chỉnh lại startPage nếu trang cuối vượt quá số trang hiển thị        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="pagination">
                <div className="pagination-info">
                    {`${totalUsers} results`}
                </div>

                <div className="pagination-buttons">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        &lt;
                    </button>

                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                        >
                            {number}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(next => Math.min(totalPages, next + 1))}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={`users-table-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            {/* Khu vực lọc */}
            <div className="filters-container">
                <div className="filter-group">
                    <label htmlFor="nameFilter">Name:</label>
                    <input
                        id="nameFilter"
                        type="text"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="Filter by name"
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="emailFilter">Email:</label>
                    <input
                        id="emailFilter"
                        type="text"
                        name="email"
                        value={filters.email}
                        onChange={handleFilterChange}
                        placeholder="Filter by email"
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="statusFilter">Status:</label>
                    <select
                        id="statusFilter"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Hiển thị lỗi nếu có */}
            {error && <div className="error-message">{error}</div>}

            {/* Hiển thị spinner khi đang tải */}
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading users data...</p>
                </div>
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>
                                        <input type="checkbox" />
                                    </th>
                                    <th onClick={() => handleSort('name')} className="sortable-header">
                                        Name
                                    </th>
                                    <th onClick={() => handleSort('balance')} className="sortable-header">
                                        Balance ($)
                                    </th>
                                    <th onClick={() => handleSort('email')} className="sortable-header">
                                        Email
                                    </th>
                                    <th onClick={() => handleSort('registerAt')} className="sortable-header">
                                        Registration
                                    </th>
                                    <th onClick={() => handleSort('active')} className="sortable-header">
                                        Status
                                    </th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <input type="checkbox" checked={user.active} readOnly />
                                        </td>
                                        <td>{user.name}</td>
                                        <td>{formatBalance(user.balance)}</td>
                                        <td>
                                            <Link className="email__link" to={`mailto:${user.email}`}>{user.email}</Link>
                                        </td>
                                        <td className="registration-container" title={formatDetailedDate(user.registerAt)}>
                                            {formatDate(user.registerAt)}
                                        </td>
                                        <td>
                                            <button className={`status-btn`}>
                                                Status
                                            </button>
                                        </td>
                                        <td className="action-buttons">
                                            <button className="edit-btn">
                                                <span role="img" aria-label="edit">
                                                    <FaPen />
                                                </span>
                                            </button>
                                            <button className="delete-btn">
                                                <span role="img" aria-label="delete">
                                                    <FaTrashAlt />
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang */}
                    {renderPagination()}
                </>
            )}
        </div>
    );
}

export default UsersTable;