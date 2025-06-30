import React from 'react';

export default function OverTable({ filteredList, styles }) {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>資産番号</th>
                    <th>ユーザ番号</th>
                    <th>名前</th>
                    <th>返却予定日</th>
                    <th>備考</th>
                </tr>
            </thead>
            <tbody>
                {filteredList.length === 0 ? (
                    <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>延滞中の貸出はありません</td>
                    </tr>
                ) : (
                    filteredList.map(item => (
                        <tr key={item.id || item.asset_num}>
                            <td>{item.asset_num}</td>
                            <td>{item.user_no}</td>
                            <td>{item.name}</td>
                            <td className={styles.redText}>
                                {item.return_date ? item.return_date.replace(/-/g, "/").slice(0, 10) : ''}
                            </td>
                            <td>{item.remarks}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}