import React from 'react';

export default function UserTable({ users, onDetail, styles }) {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>社員番号</th>
                    <th>名前</th>
                    <th>部署</th>
                    <th>役職</th>
                    <th>詳細</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.employee_no}>
                        <td>{user.employee_no}</td>
                        <td>{user.name}</td>
                        <td>{user.department}</td>
                        <td>{user.position}</td>
                        <td>
                            <button
                                className={styles.detailBtn}
                                onClick={() => onDetail(user)}
                            >
                                詳細
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}